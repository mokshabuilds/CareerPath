import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LanguageCode, StreamType } from '../types';
import { SUPPORTED_LANGUAGES, TranslationDict, TRANSLATIONS } from '../i18n/translations';
import { useAuth } from './AuthContext';

const LANGUAGE_STORAGE_KEY = 'careerpath_language_v1';
const CACHE_KEY_PREFIX = 'careerpath_tr_cache_v1_';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof TranslationDict) => string;
  tStream: (stream: StreamType | 'All Streams' | string) => string;
  tType: (type: 'Government' | 'Private' | string) => string;
  translateText: (text: string) => string;
  requestTranslation: (texts: string[]) => void;
  isTranslating: boolean;
  currentLanguageOption: (typeof SUPPORTED_LANGUAGES)[number];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function loadCache(lang: LanguageCode): Record<string, string> {
  if (lang === 'en') return {};
  try {
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${lang}`);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveCache(lang: LanguageCode, cache: Record<string, string>) {
  if (lang === 'en') return;
  try {
    // Keep cache bounded (~600 entries)
    const entries = Object.entries(cache);
    const trimmed = entries.length > 600 ? Object.fromEntries(entries.slice(-600)) : cache;
    localStorage.setItem(`${CACHE_KEY_PREFIX}${lang}`, JSON.stringify(trimmed));
  } catch {
    // Ignore storage quota errors
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth();

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [cache, setCache] = useState<Record<string, string>>(() => loadCache(language));
  const [pendingCount, setPendingCount] = useState(0);
  const queueRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  // Sync from user profile on login
  useEffect(() => {
    if (user?.preferredLanguage && SUPPORTED_LANGUAGES.some((l) => l.code === user.preferredLanguage)) {
      setLanguageState(user.preferredLanguage);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, user.preferredLanguage);
    }
  }, [user?.id, user?.preferredLanguage]);

  // Update HTML lang attribute and reload cache when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    queueRef.current.clear();
    inFlightRef.current.clear();
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCache(loadCache(language));
    setPendingCount(0);
  }, [language]);

  const setLanguage = useCallback(
    (nextLang: LanguageCode) => {
      setLanguageState(nextLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
      if (user && user.preferredLanguage !== nextLang) {
        updateProfile({ preferredLanguage: nextLang });
      }
    },
    [user, updateProfile]
  );

  const flushQueue = useCallback(
    async (targetLang: LanguageCode) => {
      if (targetLang === 'en') {
        queueRef.current.clear();
        return;
      }
      const batch = Array.from(queueRef.current).filter(
        (txt) => txt && !cacheRef.current[txt] && !inFlightRef.current.has(txt)
      );
      queueRef.current.clear();
      if (batch.length === 0) return;

      // Chunk in batches of up to 24 strings for fast translation
      const chunks: string[][] = [];
      for (let i = 0; i < batch.length; i += 24) {
        chunks.push(batch.slice(i, i + 24));
      }

      for (const chunk of chunks) {
        chunk.forEach((s) => inFlightRef.current.add(s));
        setPendingCount((c) => c + 1);
        try {
          const resp = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetLanguage: targetLang, texts: chunk }),
          });
          if (resp.ok) {
            const data = (await resp.json()) as { translations?: string[] };
            if (Array.isArray(data.translations) && data.translations.length === chunk.length) {
              setCache((prev) => {
                // Only apply if user hasn't switched away
                const next = { ...prev };
                chunk.forEach((src, i) => {
                  const tr = data.translations?.[i];
                  if (tr && typeof tr === 'string') {
                    next[src] = tr;
                  }
                });
                saveCache(targetLang, next);
                return next;
              });
            }
          }
        } catch {
          // Graceful fallback to source English text
        } finally {
          chunk.forEach((s) => inFlightRef.current.delete(s));
          setPendingCount((c) => Math.max(0, c - 1));
        }
      }
    },
    []
  );

  const requestTranslation = useCallback(
    (texts: string[]) => {
      if (language === 'en') return;
      let added = false;
      for (const raw of texts) {
        const text = raw?.trim();
        if (!text || text.length < 2) continue;
        if (!cacheRef.current[text] && !inFlightRef.current.has(text) && !queueRef.current.has(text)) {
          queueRef.current.add(text);
          added = true;
        }
      }
      if (added) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        const activeLang = language;
        timerRef.current = window.setTimeout(() => {
          flushQueue(activeLang);
        }, 60);
      }
    },
    [language, flushQueue]
  );

  const translateText = useCallback(
    (text: string): string => {
      if (language === 'en' || !text) return text;
      const clean = text.trim();
      return cache[clean] || text;
    },
    [language, cache]
  );

  const t = useCallback(
    (key: keyof TranslationDict): string => {
      return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
    },
    [language]
  );

  const tStream = useCallback(
    (stream: StreamType | 'All Streams' | string): string => {
      const key = `stream.${stream}` as keyof TranslationDict;
      return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || stream;
    },
    [language]
  );

  const tType = useCallback(
    (type: 'Government' | 'Private' | string): string => {
      if (type === 'Government') return t('common.government');
      if (type === 'Private') return t('common.private');
      return type;
    },
    [t]
  );

  const currentLanguageOption = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0],
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tStream,
        tType,
        translateText,
        requestTranslation,
        isTranslating: pendingCount > 0,
        currentLanguageOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return ctx;
}

/**
 * Automatically queues a list of guidance texts for background translation
 * whenever the selected language is not English.
 */
export function useAutoTranslate(texts: string[]) {
  const { language, requestTranslation, translateText } = useLanguage();
  const signature = texts.join('\u0000');

  useEffect(() => {
    if (language !== 'en' && texts.length > 0) {
      requestTranslation(texts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, signature, requestTranslation]);

  return translateText;
}
