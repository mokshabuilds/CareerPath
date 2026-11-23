import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import BookmarkButton from '../components/BookmarkButton';
import { COURSES } from '../data/courses';
import { getStreamTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [stream, setStream] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const { t, tStream, isTranslating } = useLanguage();

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COURSES.filter((course) => {
      if (level !== 'All' && course.level !== level) return false;
      if (stream !== 'All' && course.stream !== stream) return false;
      if (durationFilter === 'short' && course.durationYears > 2) return false;
      if (durationFilter === 'three' && (course.durationYears < 3 || course.durationYears > 3.5)) return false;
      if (durationFilter === 'fourPlus' && course.durationYears < 4) return false;
      if (!q) return true;
      return (
        course.title.toLowerCase().includes(q) ||
        course.shortName.toLowerCase().includes(q) ||
        course.overview.toLowerCase().includes(q)
      );
    });
  }, [search, level, stream, durationFilter]);

  const textsToTranslate = useMemo(() => {
    const list: string[] = [];
    filteredCourses.forEach((c) => {
      list.push(c.title, c.overview);
    });
    return list;
  }, [filteredCourses]);
  const tr = useAutoTranslate(textsToTranslate);

  const hasActiveFilters =
    search !== '' || level !== 'All' || stream !== 'All' || durationFilter !== 'All';

  const resetFilters = () => {
    setSearch('');
    setLevel('All');
    setStream('All');
    setDurationFilter('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-[#7C3AED]">{t('courses.kicker')}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('courses.title')}</h1>
          <p className="text-slate-600 text-sm sm:text-base">{t('courses.subtitle')}</p>
        </div>
        <div className="w-full lg:w-96">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t('courses.searchPlaceholder')}
            ariaLabel={t('courses.title')}
            commandStyle
          />
        </div>
      </div>

      {isTranslating && (
        <p className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
      )}

      <FilterPanel
        resultCount={filteredCourses.length}
        resultLabel={t('courses.label')}
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
        groups={[
          {
            id: 'level',
            label: 'Level',
            value: level,
            onChange: setLevel,
            variant: 'tabs',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: 'UG', value: 'UG' },
              { label: 'PG', value: 'PG' },
              { label: 'Diploma', value: 'Diploma' },
            ],
          },
          {
            id: 'stream',
            label: t('colleges.filterStream'),
            value: stream,
            onChange: setStream,
            variant: 'select',
            options: [
              { label: t('colleges.allStreams'), value: 'All' },
              { label: tStream('Science'), value: 'Science' },
              { label: tStream('Commerce'), value: 'Commerce' },
              { label: tStream('Arts'), value: 'Arts' },
              { label: tStream('Vocational'), value: 'Vocational' },
            ],
          },
          {
            id: 'duration',
            label: 'Duration',
            value: durationFilter,
            onChange: setDurationFilter,
            variant: 'select',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: 'Up to 2 Years', value: 'short' },
              { label: '3 Years', value: 'three' },
              { label: '4+ Years', value: 'fourPlus' },
            ],
          },
        ]}
      />

      {filteredCourses.length === 0 ? (
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No matching courses found</h2>
            <p className="text-sm text-slate-600">Adjust your degree level, stream, or duration filters.</p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-xl transition-colors"
          >
            {t('common.resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => {
            const theme = getStreamTheme(course.stream);
            return (
              <motion.article
                key={course.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.2, delay: (idx % 6) * 0.04 }}
                whileHover={{ y: -4 }}
                className={`bg-white border border-slate-200/90 ${theme.borderHover} ${theme.glowShadow} rounded-2xl overflow-hidden flex flex-col justify-between transition-all`}
              >
                <div>
                  <div className={`px-6 py-3.5 ${theme.softBg} border-b border-slate-100 flex items-center justify-between gap-3`}>
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <span className={`w-7 h-7 rounded-lg ${theme.iconBg} text-white inline-flex items-center justify-center`}>
                        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <span className={theme.textAccent}>{course.level}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tStream(course.stream)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{course.duration}</span>
                    </div>
                    <BookmarkButton type="courses" itemId={course.id} itemLabel={course.shortName} compact />
                  </div>

                  <div className="p-6 space-y-2.5">
                    <Link to={`/courses/${course.id}`} className="block group">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                        {tr(course.title)}
                      </h2>
                    </Link>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{tr(course.overview)}</p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">{t('courses.estimatedFees')}</p>
                    <p className="text-sm font-bold text-slate-900 tabular-nums">{course.feesRange}</p>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold ${theme.textAccent} ${theme.softBg} border border-slate-200/70 rounded-xl transition-colors whitespace-nowrap`}
                  >
                    <span>{t('courses.courseDetails')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
