import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  variant?: 'navbar' | 'mobile' | 'profile';
}

export default function LanguageSelector({ variant = 'navbar' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  if (variant === 'profile') {
    return (
      <div className="space-y-1.5">
        <label htmlFor="prof-language" className="block text-xs font-semibold text-slate-700">
          {t('profile.preferredLanguage')}
        </label>
        <div className="relative">
          <Globe
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <select
            id="prof-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-[#4F46E5] outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.englishName})
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-slate-500">{t('profile.preferredLanguageHint')}</p>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
        <label htmlFor="mobile-lang-select" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Globe className="w-4 h-4 text-[#4F46E5]" aria-hidden="true" />
          <span>{t('nav.language')}</span>
        </label>
        <select
          id="mobile-lang-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#4F46E5]"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="relative hidden md:inline-flex items-center shrink-0">
      <Globe
        className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none"
        aria-hidden="true"
      />
      <select
        aria-label={t('nav.language')}
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className="h-10 pl-8 pr-3 bg-slate-50/90 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 focus:border-[#4F46E5] outline-none transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
