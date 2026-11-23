import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { CAREERS } from '../data/careers';
import { COURSES } from '../data/courses';
import { EXAMS } from '../data/exams';
import { useAuth } from '../context/AuthContext';
import { getStreamTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

const CELEBRATION_PARTICLES = [
  { id: 1, x: -140, y: -48, color: 'bg-blue-400', delay: 0.05 },
  { id: 2, x: -85, y: -72, color: 'bg-violet-400', delay: 0.1 },
  { id: 3, x: -30, y: -56, color: 'bg-cyan-400', delay: 0.07 },
  { id: 4, x: 40, y: -64, color: 'bg-amber-400', delay: 0.12 },
  { id: 5, x: 95, y: -52, color: 'bg-emerald-400', delay: 0.08 },
  { id: 6, x: 145, y: -40, color: 'bg-rose-400', delay: 0.14 },
  { id: 7, x: -110, y: 38, color: 'bg-indigo-300', delay: 0.15 },
  { id: 8, x: 115, y: 36, color: 'bg-cyan-300', delay: 0.11 },
];

export default function QuizPage() {
  const { user, saveQuizResult } = useAuth();
  const { t, tStream, isTranslating } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[stepIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progressPercent = Math.round(((stepIndex + (submitted ? 1 : 0)) / totalQuestions) * 100);

  const computeResults = () => {
    const careerScores: Record<string, number> = {};
    CAREERS.forEach((c) => {
      careerScores[c.id] = 0;
    });

    QUIZ_QUESTIONS.forEach((q) => {
      const selectedId = answers[q.id];
      const opt = q.options.find((o) => o.id === selectedId);
      if (opt) {
        Object.entries(opt.weights).forEach(([careerId, weight]) => {
          careerScores[careerId] = (careerScores[careerId] || 0) + weight;
        });
      }
    });

    const ranked = Object.entries(careerScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([careerId, score]) => ({
        career: CAREERS.find((c) => c.id === careerId)!,
        score,
      }));

    return { ranked, careerScores };
  };

  const resultsPreview = useMemo(() => (submitted ? computeResults() : null), [submitted, answers]);

  const textsToTranslate = useMemo(() => {
    const list: string[] = [
      currentQuestion.prompt,
      currentQuestion.dimension,
      ...currentQuestion.options.map((o) => o.label),
    ];
    if (resultsPreview) {
      resultsPreview.ranked.forEach(({ career }) => {
        list.push(career.title, career.overview);
      });
    }
    return list;
  }, [currentQuestion, resultsPreview]);
  const tr = useAutoTranslate(textsToTranslate);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleFinish = () => {
    const { ranked, careerScores } = computeResults();
    const topIds = ranked.map((r) => r.career.id);
    const traits = Array.from(new Set(ranked.map((r) => r.career.interestArea)));
    setSubmitted(true);

    if (user) {
      saveQuizResult({
        topCareerIds: topIds,
        dominantTraits: traits,
        scores: careerScores,
      });
      setSavedNotice(true);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setStepIndex(0);
    setSubmitted(false);
    setSavedNotice(false);
  };

  if (submitted && resultsPreview) {
    const { ranked } = resultsPreview;
    const maxScore = Math.max(1, ranked[0]?.score || 1);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <motion.section
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-7 sm:p-10 text-white shadow-xl border border-indigo-500/30"
        >
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-12 w-64 h-64 rounded-full bg-cyan-500/25 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-12 w-72 h-72 rounded-full bg-violet-500/25 blur-3xl pointer-events-none"
          />

          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {CELEBRATION_PARTICLES.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: p.x,
                  y: p.y,
                  scale: [0.4, 1.15, 0.6],
                  rotate: [0, 90, 180],
                }}
                transition={{ duration: 1.25, delay: p.delay, ease: 'easeOut' }}
                className={`absolute w-2.5 h-2.5 rounded-sm ${p.color}`}
              />
            ))}
          </div>

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-cyan-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('quiz.kicker')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                {t('quiz.top3Title')}
              </h1>
            </div>

            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 rounded-xl transition-colors whitespace-nowrap self-start sm:self-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('quiz.retake')}</span>
            </button>
          </div>
        </motion.section>

        {isTranslating && (
          <p className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
        )}

        {savedNotice ? (
          <div className="bg-blue-50/90 border border-blue-200 text-blue-950 rounded-xl px-4 py-3 text-sm flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              Results saved to your student profile and dashboard.
            </span>
            <Link to="/dashboard" className="text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap">
              {t('nav.dashboard')}
            </Link>
          </div>
        ) : (
          <div className="bg-purple-50/90 border border-purple-200 text-purple-950 rounded-xl px-4 py-3 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>Sign in or create a free student account to save these quiz results to your profile.</span>
            <Link
              to="/login"
              state={{ from: '/quiz' }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-lg whitespace-nowrap self-start sm:self-auto"
            >
              {t('nav.signIn')}
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {ranked.map(({ career, score }, idx) => {
            const matchPct = Math.min(98, Math.max(72, Math.round((score / maxScore) * 96)));
            const relatedCourses = COURSES.filter((c) => career.recommendedCourseIds.includes(c.id));
            const relatedExams = EXAMS.filter((e) => career.recommendedExamIds.includes(e.id));
            const theme = getStreamTheme(career.stream);

            return (
              <motion.article
                key={career.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.1 + idx * 0.1 }}
                className={`bg-white border border-slate-200/90 ${theme.borderHover} ${theme.glowShadow} rounded-2xl overflow-hidden transition-all`}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradientBar}`} />
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-2 tabular-nums">
                        <span className={`inline-flex items-center gap-1 ${theme.textAccent}`}>
                          <Award className="w-3.5 h-3.5" />
                          0{idx + 1} · {matchPct}%
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{tStream(career.stream)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{career.averageSalary}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">{tr(career.title)}</h2>

                      <div className="max-w-sm pt-1 space-y-1">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${matchPct}%` }}
                            transition={{ duration: 0.7, delay: 0.25 + idx * 0.12, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${theme.gradientBar}`}
                          />
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/careers/${career.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 rounded-xl transition-opacity whitespace-nowrap self-start shadow-xs"
                    >
                      <span>{t('careers.fullRoadmap')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">{tr(career.overview)}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">{t('careers.recommendedCourses')}</p>
                      <div className="flex flex-wrap gap-2">
                        {relatedCourses.map((course) => (
                          <Link
                            key={course.id}
                            to={`/courses/${course.id}`}
                            className="px-3 py-1.5 text-xs font-semibold text-[#7C3AED] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                          >
                            {course.shortName}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">{t('careers.keyExams')}</p>
                      <div className="flex flex-wrap gap-2">
                        {relatedExams.map((exam) => (
                          <Link
                            key={exam.id}
                            to={`/exams?highlight=${exam.id}`}
                            className="px-3 py-1.5 text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            {exam.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    );
  }

  const selectedForCurrent = answers[currentQuestion.id];
  const barPercent = Math.max(8, Math.round(((stepIndex + 1) / totalQuestions) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <p className="text-xs font-semibold text-[#7C3AED]">{t('quiz.kicker')}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('quiz.title')}</h1>
          <p className="text-sm text-slate-600">{t('quiz.subtitle')}</p>
          {isTranslating && (
            <p className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
          )}
        </div>
        <div className="hidden md:block md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <img
            src="/src/assets/images/career_roadmap_desk_1795426217045.jpg"
            alt="Career planning notebook and study desk"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <section className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold tabular-nums">
              <span className="text-[#4F46E5]">
                {stepIndex + 1} / {totalQuestions} · {tr(currentQuestion.dimension)}
              </span>
              <span className="text-slate-500">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] rounded-full"
                initial={false}
                animate={{ width: `${barPercent}%` }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {tr(currentQuestion.prompt)}
              </h2>

              <div className="space-y-3" role="radiogroup" aria-label={tr(currentQuestion.prompt)}>
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedForCurrent === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-50/90 to-indigo-50/80 border-[#4F46E5] ring-2 ring-indigo-100 text-slate-900 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold inline-flex items-center justify-center shrink-0 mt-0.5 tabular-nums transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm sm:text-base font-medium leading-snug">{tr(opt.label)}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('quiz.previous')}</span>
            </button>

            {stepIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setStepIndex((prev) => prev + 1)}
                disabled={!selectedForCurrent}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 disabled:opacity-40 rounded-xl transition-opacity"
              >
                <span>{t('quiz.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={!selectedForCurrent}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#2563EB] hover:opacity-95 disabled:opacity-40 rounded-xl transition-opacity shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('quiz.seeResults')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
