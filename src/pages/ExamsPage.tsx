import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, ExternalLink, ListFilter } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { EXAMS } from '../data/exams';
import { CAREERS } from '../data/careers';
import { getDaysUntil, getStreamTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function ExamsPage() {
  const [searchParams] = useSearchParams();
  const initialHighlight = searchParams.get('highlight') || '';

  const [search, setSearch] = useState('');
  const [stream, setStream] = useState('All');
  const [viewMode, setViewMode] = useState<'directory' | 'timeline'>('directory');
  const [selectedExamId, setSelectedExamId] = useState<string>(initialHighlight || EXAMS[0].id);
  const { t, tStream, isTranslating } = useLanguage();

  const filteredExams = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EXAMS.filter((exam) => {
      if (stream !== 'All' && exam.stream !== stream) return false;
      if (!q) return true;
      return (
        exam.name.toLowerCase().includes(q) ||
        exam.fullName.toLowerCase().includes(q) ||
        exam.conductingBody.toLowerCase().includes(q)
      );
    }).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  }, [search, stream]);

  const activeExam = useMemo(() => {
    return (
      filteredExams.find((e) => e.id === selectedExamId) ||
      filteredExams[0] ||
      EXAMS[0]
    );
  }, [filteredExams, selectedExamId]);

  const relatedCareers = useMemo(() => {
    if (!activeExam) return [];
    return CAREERS.filter((c) => activeExam.relatedCareerIds.includes(c.id));
  }, [activeExam]);

  const textsToTranslate = useMemo(() => {
    const list: string[] = [];
    filteredExams.forEach((e) => list.push(e.fullName, e.mode));
    if (activeExam) {
      list.push(
        activeExam.fullName,
        activeExam.eligibility,
        activeExam.pattern,
        activeExam.mode,
        ...activeExam.syllabusSummary,
        ...activeExam.preparationTips
      );
    }
    relatedCareers.forEach((c) => list.push(c.title));
    return list;
  }, [filteredExams, activeExam, relatedCareers]);
  const tr = useAutoTranslate(textsToTranslate);

  const activeTheme = activeExam ? getStreamTheme(activeExam.stream) : getStreamTheme('All Streams');
  const activeDaysLeft = activeExam ? getDaysUntil(activeExam.isoDate) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-[#4F46E5]">{t('exams.kicker')}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('exams.title')}</h1>
          <p className="text-slate-600 text-sm sm:text-base">{t('exams.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl relative">
            <button
              type="button"
              onClick={() => setViewMode('directory')}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                viewMode === 'directory' ? 'text-[#4F46E5]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {viewMode === 'directory' && (
                <motion.span
                  layoutId="exams-view-tab"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/70"
                />
              )}
              <ListFilter className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{t('exams.guideTab')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                viewMode === 'timeline' ? 'text-[#7C3AED]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {viewMode === 'timeline' && (
                <motion.span
                  layoutId="exams-view-tab"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/70"
                />
              )}
              <Calendar className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{t('exams.calendarTab')}</span>
            </button>
          </div>

          <div className="w-full sm:w-72">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={t('exams.searchPlaceholder')}
              ariaLabel={t('exams.title')}
              commandStyle
            />
          </div>
        </div>
      </div>

      {isTranslating && (
        <p className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
      )}

      <FilterPanel
        resultCount={filteredExams.length}
        resultLabel={t('exams.label')}
        hasActiveFilters={search !== '' || stream !== 'All'}
        onReset={() => {
          setSearch('');
          setStream('All');
        }}
        groups={[
          {
            id: 'exam-stream',
            label: t('colleges.filterStream'),
            value: stream,
            onChange: setStream,
            variant: 'tabs',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: tStream('Science'), value: 'Science' },
              { label: tStream('Arts'), value: 'Arts' },
              { label: tStream('All Streams'), value: 'All Streams' },
            ],
          },
        ]}
      />

      {filteredExams.length === 0 ? (
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">No exams match your filter</h2>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStream('All');
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-xl"
          >
            {t('common.resetFilters')}
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        <section
          aria-label={t('exams.calendarTab')}
          className="bg-white/95 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]" />
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t('exams.calendarTab')} · 2026–2027</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredExams.map((exam, idx) => {
                const theme = getStreamTheme(exam.stream);
                const daysLeft = getDaysUntil(exam.isoDate);
                const isImminent = daysLeft <= 45;
                return (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: idx * 0.03 }}
                    className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    <div className="md:col-span-3 space-y-1">
                      <p className="text-sm font-bold text-slate-900 tabular-nums">{exam.examDate}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                            isImminent
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-indigo-50 text-[#4F46E5] border border-indigo-100'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {daysLeft}d
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 tabular-nums">{exam.applicationDeadline}</p>
                    </div>

                    <div className="md:col-span-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradientBar}`} />
                        <span className={`text-xs font-semibold ${theme.textAccent}`}>{tStream(exam.stream)}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {exam.name} — {tr(exam.fullName)}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {exam.conductingBody} · {tr(exam.mode)}
                      </p>
                    </div>

                    <div className="md:col-span-3 flex md:justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExamId(exam.id);
                          setViewMode('directory');
                        }}
                        className="px-3.5 py-2 text-xs font-semibold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                      >
                        {t('common.details')}
                      </button>
                      <a
                        href={exam.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl inline-flex items-center gap-1"
                      >
                        <span>{t('common.visitSite')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-2.5">
            {filteredExams.map((exam) => {
              const selected = activeExam?.id === exam.id;
              const theme = getStreamTheme(exam.stream);
              const daysLeft = getDaysUntil(exam.isoDate);
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                    selected
                      ? 'bg-white border-[#4F46E5] shadow-md ring-2 ring-indigo-100'
                      : 'bg-white/90 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {selected && (
                    <div className={`absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b ${theme.gradientBar}`} />
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold text-slate-900">{exam.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#4F46E5] tabular-nums">
                      {daysLeft}d
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">{tr(exam.fullName)}</p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1.5 tabular-nums">{exam.examDate}</p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeExam && (
                <motion.section
                  key={activeExam.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${activeTheme.gradientBar}`} />
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                          <span className={activeTheme.textAccent}>
                            {activeExam.conductingBody} · {tStream(activeExam.stream)}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 tabular-nums">
                            <Clock className="w-3 h-3" />
                            {activeDaysLeft}d
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{activeExam.name}</h2>
                        <p className="text-sm text-slate-600">{tr(activeExam.fullName)}</p>
                      </div>
                      <a
                        href={activeExam.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 rounded-xl transition-opacity whitespace-nowrap shrink-0 shadow-xs"
                      >
                        <span>{t('exams.officialWebsite')}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500">Exam Date</p>
                        <p className="text-sm font-bold text-slate-900 tabular-nums mt-0.5">{activeExam.examDate}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-100">
                        <p className="text-xs text-violet-700 font-medium">Application Deadline</p>
                        <p className="text-sm font-bold text-violet-900 tabular-nums mt-0.5">
                          {activeExam.applicationDeadline}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500">Exam Mode</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{tr(activeExam.mode)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-900">{t('exams.eligibility')}</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">{tr(activeExam.eligibility)}</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-900">{t('exams.pattern')}</h3>
                      <p className="text-slate-700 leading-relaxed font-mono text-xs sm:text-sm bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                        {tr(activeExam.pattern)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900">{t('exams.syllabus')}</h3>
                        <ul className="space-y-2">
                          {activeExam.syllabusSummary.map((line) => (
                            <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                              <span>{tr(line)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900">{t('exams.tips')}</h3>
                        <ul className="space-y-2">
                          {activeExam.preparationTips.map((tip) => (
                            <li key={tip} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                              <span>{tr(tip)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {relatedCareers.length > 0 && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-2">{t('nav.careers')}</p>
                        <div className="flex flex-wrap gap-2">
                          {relatedCareers.map((career) => (
                            <Link
                              key={career.id}
                              to={`/careers/${career.id}`}
                              className="px-3 py-1.5 text-xs font-semibold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                              {tr(career.title)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
