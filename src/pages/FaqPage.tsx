import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { FAQS } from '../data/testimonials';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);
  const { t, isTranslating } = useLanguage();

  const textsToTranslate = useMemo(() => {
    const list: string[] = [];
    FAQS.forEach((f) => list.push(f.category, f.question, f.answer));
    return list;
  }, []);
  const tr = useAutoTranslate(textsToTranslate);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#7C3AED]">{t('faq.kicker')}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('faq.title')}</h1>
        {isTranslating && (
          <p className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
        )}
      </div>

      <div className="bg-white/95 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]" />
        <div className="divide-y divide-slate-100">
          {FAQS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="p-5 sm:p-6">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full text-left flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#4F46E5]">{tr(item.category)}</p>
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                      {tr(item.question)}
                    </h2>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#4F46E5]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{tr(item.answer)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <p className="text-sm text-slate-700 font-medium">{t('contact.title')}</p>
        <Link
          to="/contact"
          className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 rounded-xl transition-opacity whitespace-nowrap self-start sm:self-auto"
        >
          {t('nav.contact')}
        </Link>
      </div>
    </div>
  );
}
