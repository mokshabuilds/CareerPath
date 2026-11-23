import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Scale, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { t, isTranslating } = useLanguage();

  const pillars = useMemo(
    () => [
      {
        step: '01',
        title: 'Structured Roadmaps',
        heading: 'Beyond buzzwords',
        desc: 'Every career profile maps out the exact Class 10 and Class 12 subjects, entrance exams, required skills, and realistic starting compensation in India.',
        bar: 'from-blue-600 to-cyan-500',
        iconBg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
        icon: Compass,
      },
      {
        step: '02',
        title: 'Transparent Comparisons',
        heading: 'ROI & NIRF clarity',
        desc: 'Compare up to three Government or Private colleges side by side on tuition fees, median placements, and accepted entrance exams.',
        bar: 'from-emerald-600 to-teal-500',
        iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-500',
        icon: Scale,
      },
      {
        step: '03',
        title: 'Accessible Guidance',
        heading: 'Quiz & AI Counselor',
        desc: 'Combine our 12-question aptitude quiz with real-time Gemini-powered counseling tailored to your academic stream and personal interests.',
        bar: 'from-violet-600 to-rose-500',
        iconBg: 'bg-gradient-to-br from-violet-600 to-rose-500',
        icon: Sparkles,
      },
    ],
    []
  );

  const introDesc =
    "Choosing a stream after Class 10, picking a degree after Class 12, or navigating dozens of entrance exams and scholarships shouldn't rely on guesswork. CareerPath brings verified Indian career roadmaps, college comparisons, exam timelines, and personalized AI counseling into one distraction-free student portal.";

  const textsToTranslate = useMemo(() => {
    const list = [introDesc];
    pillars.forEach((p) => list.push(p.title, p.heading, p.desc));
    return list;
  }, [pillars]);
  const tr = useAutoTranslate(textsToTranslate);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white/95 bg-dot-grid border border-slate-200/90 rounded-3xl p-8 sm:p-10 space-y-5 overflow-hidden shadow-xs"
      >
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-400/15 blur-3xl pointer-events-none"
        />
        <p className="relative text-xs font-semibold text-[#7C3AED]">{t('about.kicker')}</p>
        <h1 className="relative text-3xl sm:text-4xl font-bold text-slate-900">{t('about.title')}</h1>
        <p className="relative text-base text-slate-700 leading-relaxed max-w-3xl">{tr(introDesc)}</p>
        {isTranslating && (
          <p className="relative text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
        )}
      </motion.section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.22, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${item.bar}`} />
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${item.iconBg} text-white inline-flex items-center justify-center shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">{item.step}</span>
                </div>
                <p className="text-xs font-semibold text-[#4F46E5]">{tr(item.title)}</p>
                <h2 className="text-lg font-bold text-slate-900">{tr(item.heading)}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{tr(item.desc)}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 sm:p-10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-10 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"
        />
        <div className="relative">
          <h2 className="text-xl sm:text-2xl font-bold">{t('home.ctaTitle')}</h2>
          <p className="text-sm text-slate-300 mt-1">{t('home.ctaDesc')}</p>
        </div>
        <div className="relative flex flex-wrap gap-3 shrink-0">
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:opacity-95 rounded-xl transition-opacity"
          >
            <span>{t('home.takeQuiz')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors"
          >
            <span>{t('nav.contact')}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
