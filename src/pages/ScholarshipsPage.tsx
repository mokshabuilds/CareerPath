import { useMemo, useState } from 'react';
import { Award, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import BookmarkButton from '../components/BookmarkButton';
import { SCHOLARSHIPS } from '../data/scholarships';
import { getDaysUntil, getScholarshipCategoryTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function ScholarshipsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [gender, setGender] = useState('All');
  const [incomeFilter, setIncomeFilter] = useState('All');
  const { t, isTranslating } = useLanguage();

  const filteredScholarships = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SCHOLARSHIPS.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (level !== 'All' && item.level !== level) return false;
      if (gender === 'Female' && item.genderEligibility !== 'Female') return false;
      if (incomeFilter === 'low' && !item.incomeLimit.includes('2.5') && !item.incomeLimit.includes('2 Lakh')) {
        return false;
      }
      if (incomeFilter === 'no-limit' && !item.incomeLimit.toLowerCase().includes('no income')) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.eligibility.toLowerCase().includes(q)
      );
    }).sort((a, b) => a.isoDeadline.localeCompare(b.isoDeadline));
  }, [search, category, level, gender, incomeFilter]);

  const textsToTranslate = useMemo(() => {
    const list: string[] = [];
    filteredScholarships.forEach((s) => {
      list.push(s.title, s.eligibility, s.incomeLimit, ...s.documentsRequired);
    });
    return list;
  }, [filteredScholarships]);
  const tr = useAutoTranslate(textsToTranslate);

  const hasActiveFilters =
    search !== '' || category !== 'All' || level !== 'All' || gender !== 'All' || incomeFilter !== 'All';

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setGender('All');
    setIncomeFilter('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-[#4F46E5]">{t('scholarships.kicker')}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('scholarships.title')}</h1>
          <p className="text-slate-600 text-sm sm:text-base">{t('scholarships.subtitle')}</p>
        </div>
        <div className="w-full lg:w-96">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t('scholarships.searchPlaceholder')}
            ariaLabel={t('scholarships.title')}
            commandStyle
          />
        </div>
      </div>

      {isTranslating && (
        <p className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
      )}

      <FilterPanel
        resultCount={filteredScholarships.length}
        resultLabel={t('scholarships.label')}
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
        groups={[
          {
            id: 'sch-category',
            label: 'Category',
            value: category,
            onChange: setCategory,
            variant: 'tabs',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: 'Merit', value: 'Merit' },
              { label: 'Need-Based', value: 'Need-Based' },
              { label: 'Minority / Reserved', value: 'Minority / Reserved' },
              { label: 'Women in STEM', value: 'Women in STEM' },
            ],
          },
          {
            id: 'sch-level',
            label: 'Level',
            value: level,
            onChange: setLevel,
            variant: 'select',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: 'School (11–12)', value: 'School (11–12)' },
              { label: 'UG', value: 'UG' },
              { label: 'PG', value: 'PG' },
              { label: 'UG & PG', value: 'UG & PG' },
            ],
          },
          {
            id: 'sch-gender',
            label: 'Gender',
            value: gender,
            onChange: setGender,
            variant: 'select',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: 'Female Students Only', value: 'Female' },
            ],
          },
          {
            id: 'sch-income',
            label: t('scholarships.incomeLimit'),
            value: incomeFilter,
            onChange: setIncomeFilter,
            variant: 'select',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: 'Low Income (≤ ₹2.5L)', value: 'low' },
              { label: 'No Income Ceiling', value: 'no-limit' },
            ],
          },
        ]}
      />

      {filteredScholarships.length === 0 ? (
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <Award className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No matching scholarships</h2>
            <p className="text-sm text-slate-600">Try resetting your category, income, or level filters.</p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-xl"
          >
            {t('common.resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScholarships.map((sch, idx) => {
            const theme = getScholarshipCategoryTheme(sch.category);
            const daysLeft = getDaysUntil(sch.isoDeadline);

            return (
              <motion.article
                key={sch.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.2, delay: (idx % 4) * 0.04 }}
                whileHover={{ y: -4 }}
                className={`bg-white border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
                  sch.closingSoon
                    ? 'border-amber-300 shadow-[0_10px_28px_-10px_rgba(245,158,11,0.22)]'
                    : `border-slate-200/90 ${theme.borderHover} ${theme.glowShadow}`
                }`}
              >
                <div>
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${
                      sch.closingSoon ? 'from-amber-500 via-orange-500 to-rose-500' : theme.gradientBar
                    }`}
                  />
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-2">
                          <span className={`font-semibold ${theme.textAccent}`}>{sch.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{sch.level}</span>
                          <span aria-hidden="true">·</span>
                          <span>{sch.genderEligibility === 'Female' ? 'Women Only' : 'Open to All'}</span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">{tr(sch.title)}</h2>
                        <p className="text-xs font-medium text-slate-500">{sch.provider}</p>
                      </div>
                      <BookmarkButton type="scholarships" itemId={sch.id} itemLabel={sch.title} compact />
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">{tr(sch.eligibility)}</p>

                    <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-slate-500">{t('scholarships.awardAmount')}</p>
                        <p className="font-bold text-slate-900 tabular-nums mt-0.5">{sch.amount}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-slate-500">{t('scholarships.incomeLimit')}</p>
                        <p className="font-semibold text-slate-800 mt-0.5">{tr(sch.incomeLimit)}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 pt-1">
                      {sch.documentsRequired.map((d) => tr(d)).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/75 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs tabular-nums">
                    {sch.closingSoon ? (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 font-bold">
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
                        </span>
                        {t('scholarships.closingSoon')} · {sch.deadline} ({daysLeft}d)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                        <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
                        {sch.deadline} ({daysLeft}d)
                      </span>
                    )}
                  </div>

                  <a
                    href={sch.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 rounded-xl transition-opacity whitespace-nowrap"
                  >
                    <span>{t('scholarships.apply')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
