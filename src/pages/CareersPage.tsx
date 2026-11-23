import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import BookmarkButton from '../components/BookmarkButton';
import { CAREERS } from '../data/careers';
import { getStreamTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function CareersPage() {
  const [search, setSearch] = useState('');
  const [stream, setStream] = useState('All');
  const [interestArea, setInterestArea] = useState('All');
  const [salaryBracket, setSalaryBracket] = useState('All');
  const { t, tStream, isTranslating } = useLanguage();

  const uniqueInterests = useMemo(
    () => Array.from(new Set(CAREERS.map((c) => c.interestArea))).sort(),
    []
  );

  const filteredCareers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CAREERS.filter((career) => {
      if (stream !== 'All' && career.stream !== stream) return false;
      if (interestArea !== 'All' && career.interestArea !== interestArea) return false;
      if (salaryBracket !== 'All' && career.salaryBracket !== salaryBracket) return false;
      if (!q) return true;
      return (
        career.title.toLowerCase().includes(q) ||
        career.shortDesc.toLowerCase().includes(q) ||
        career.interestArea.toLowerCase().includes(q) ||
        career.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [search, stream, interestArea, salaryBracket]);

  const textsToTranslate = useMemo(() => {
    const list: string[] = [...uniqueInterests];
    filteredCareers.forEach((c) => {
      list.push(c.title, c.shortDesc, c.interestArea, ...c.requiredSkills.slice(0, 3));
    });
    return list;
  }, [filteredCareers, uniqueInterests]);
  const tr = useAutoTranslate(textsToTranslate);

  const interestOptions = useMemo(() => {
    return [
      { label: t('common.all'), value: 'All' },
      ...uniqueInterests.map((a) => ({ label: tr(a), value: a })),
    ];
  }, [t, uniqueInterests, tr]);

  const hasActiveFilters =
    search !== '' || stream !== 'All' || interestArea !== 'All' || salaryBracket !== 'All';

  const resetFilters = () => {
    setSearch('');
    setStream('All');
    setInterestArea('All');
    setSalaryBracket('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-[#4F46E5]">{t('careers.kicker')}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('careers.title')}</h1>
          <p className="text-slate-600 text-sm sm:text-base">{t('careers.subtitle')}</p>
        </div>
        <div className="w-full lg:w-96">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t('careers.searchPlaceholder')}
            ariaLabel={t('careers.title')}
            commandStyle
          />
        </div>
      </div>

      {isTranslating && (
        <p className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
      )}

      <FilterPanel
        resultCount={filteredCareers.length}
        resultLabel={t('careers.label')}
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
        groups={[
          {
            id: 'stream',
            label: t('careers.filterStream'),
            value: stream,
            onChange: setStream,
            variant: 'tabs',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: tStream('Science'), value: 'Science' },
              { label: tStream('Commerce'), value: 'Commerce' },
              { label: tStream('Arts'), value: 'Arts' },
              { label: tStream('Vocational'), value: 'Vocational' },
            ],
          },
          {
            id: 'interest',
            label: t('careers.filterInterest'),
            value: interestArea,
            onChange: setInterestArea,
            variant: 'select',
            options: interestOptions,
          },
          {
            id: 'salary',
            label: t('careers.filterSalary'),
            value: salaryBracket,
            onChange: setSalaryBracket,
            variant: 'select',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: 'Entry-Mid (4–10 LPA)', value: 'Entry-Mid (4–10 LPA)' },
              { label: 'High (10–20 LPA)', value: 'High (10–20 LPA)' },
              { label: 'Very High (20+ LPA)', value: 'Very High (20+ LPA)' },
            ],
          },
        ]}
      />

      {filteredCareers.length === 0 ? (
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <Compass className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No matching careers found</h2>
            <p className="text-sm text-slate-600">
              Try broadening your stream, interest area, or salary filter.
            </p>
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
          {filteredCareers.map((career, idx) => {
            const theme = getStreamTheme(career.stream);
            return (
              <motion.article
                key={career.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.2, delay: (idx % 6) * 0.04 }}
                whileHover={{ y: -4 }}
                className={`bg-white border border-slate-200/90 ${theme.borderHover} ${theme.glowShadow} rounded-2xl overflow-hidden flex flex-col justify-between transition-all`}
              >
                <div>
                  <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradientBar}`} />
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-2">
                        <span className={`font-semibold ${theme.textAccent}`}>{tStream(career.stream)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{tr(career.interestArea)}</span>
                      </div>
                      <BookmarkButton type="careers" itemId={career.id} itemLabel={career.title} compact />
                    </div>

                    <Link to={`/careers/${career.id}`} className="block group">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                        {tr(career.title)}
                      </h2>
                    </Link>

                    <p className="text-sm text-slate-600 leading-relaxed">{tr(career.shortDesc)}</p>

                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      {career.requiredSkills.slice(0, 3).map((s) => tr(s)).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">{t('careers.avgComp')}</p>
                    <p className="text-sm font-bold text-slate-900 tabular-nums">{career.averageSalary}</p>
                  </div>
                  <Link
                    to={`/careers/${career.id}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold ${theme.textAccent} ${theme.softBg} border border-slate-200/70 rounded-xl transition-colors whitespace-nowrap`}
                  >
                    <span>{t('careers.fullRoadmap')}</span>
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
