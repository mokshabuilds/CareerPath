import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, AlertCircle, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function CounselorWidget() {
  const { user } = useAuth();
  const { language, t, currentLanguageOption } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: t('counselor.welcome'),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  const starterPrompts = [
    t('counselor.starter1'),
    t('counselor.starter2'),
    t('counselor.starter3'),
  ];

  // Update the initial welcome message when language changes and user hasn't started chatting yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && (prev[0].id === 'welcome' || prev[0].id === 'welcome-reset')) {
        return [{ id: prev[0].id, role: 'model', text: t('counselor.welcome') }];
      }
      return prev;
    });
  }, [language, t]);

  useEffect(() => {
    const handleOpenEvent = () => setOpen(true);
    window.addEventListener('open-counselor', handleOpenEvent);
    return () => window.removeEventListener('open-counselor', handleOpenEvent);
  }, []);

  useEffect(() => {
    if (open) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  const sendMessage = async (textOverride?: string) => {
    const query = (textOverride ?? input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: query,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textOverride) setInput('');
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          messages: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          profile: user
            ? {
                name: user.name,
                qualification: user.qualification,
                currentClassOrDegree: user.currentClassOrDegree,
                interests: user.interests,
              }
            : null,
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Could not reach the counselor service.');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}`,
          role: 'model',
          text: data.reply as string,
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setError(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: t('counselor.welcome'),
      },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            aria-label={t('counselor.title')}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[410px] h-[530px] max-h-[75vh] bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl shadow-indigo-950/15 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-700 shrink-0 flex items-center justify-center border border-white/30">
                  {!avatarFailed ? (
                    <img
                      src="/src/assets/images/counselor_avatar_portrait_1795426215601.jpg"
                      alt="CareerPath AI Counselor"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold">CP</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold truncate font-display">{t('counselor.title')}</h2>
                  <p className="text-xs text-indigo-100 truncate">
                    {user ? `${user.name.split(' ')[0]} · ` : ''}
                    {currentLanguageOption.nativeName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={resetChat}
                  aria-label="Reset conversation"
                  className="p-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close AI Career Counselor"
                  className="p-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white rounded-br-sm shadow-sm'
                        : 'bg-white/95 border border-slate-200/80 text-slate-800 rounded-bl-sm shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {messages.length === 1 && !loading && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-semibold text-slate-500">{t('counselor.suggested')}</p>
                  <div className="flex flex-col gap-1.5">
                    {starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="text-left text-xs px-3.5 py-2.5 bg-white/95 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 rounded-xl text-slate-700 hover:text-[#4F46E5] transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 text-xs text-slate-600 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                    <span>{t('counselor.thinking')}</span>
                  </div>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </div>
              )}
              <div ref={listEndRef} />
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="p-3 bg-white/90 backdrop-blur-md border-t border-slate-200/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('counselor.placeholder')}
                aria-label={t('counselor.title')}
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#4F46E5] outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] disabled:opacity-40 text-white inline-flex items-center justify-center transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Minimize AI Career Counselor' : 'Open AI Career Counselor'}
        className="h-12 px-4 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#2563EB] text-white shadow-lg shadow-indigo-600/25 inline-flex items-center gap-2.5 text-sm font-semibold"
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        <span className="hidden sm:inline whitespace-nowrap">{t('counselor.button')}</span>
      </motion.button>
    </div>
  );
}
