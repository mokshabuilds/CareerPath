import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Check, MapPin, Scale, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import BookmarkButton from '../components/BookmarkButton';
import CollegeEmblem from '../components/CollegeEmblem';
import { COLLEGES } from '../data/colleges';
import { useAuth } from '../context/AuthContext';
import { useLanguage, useAutoTranslate } from '../context/LanguageContext';
import { StreamType } from '../types';

export default function CollegesPage() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [streamFilter, setStreamFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [rankFilter, setRankFilter] = useState('All');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);

  const { compareCollegeIds, toggleCompareCollege, clearCompareColleges } = useAuth();
  const { t, tStream, tType, isTranslating } = useLanguage();

  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(COLLEGES.map((c) => c.city))).sort();
    return [{ label: t('colleges.allCities'), value: 'All' }, ...cities.map((c) => ({ label: c, value: c }))];
  }, [t]);

  const stateOptions = useMemo(() => {
    const states = Array.from(new Set(COLLEGES.map((c) => c.state))).sort();
    return [{ label: t('colleges.allStates'), value: 'All' }, ...states.map((s) => ({ label: s, value: s }))];
  }, [t]);

  const courseOptions = useMemo(() => {
    const keywords = ['B.Tech', 'B.E.', 'MBBS', 'MBA', 'BBA', 'B.Com', 'BA LLB', 'B.Des', 'B.Arch', 'B.Pharm', 'Economics'];
    return [{ label: t('colleges.allCourses'), value: 'All' }, ...keywords.map((k) => ({ label: k, value: k }))];
  }, [t]);

  const filteredColleges = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COLLEGES.filter((college) => {
      if (cityFilter !== 'All' && college.city !== cityFilter) return false;
      if (stateFilter !== 'All' && college.state !== stateFilter) return false;
      if (streamFilter !== 'All' && !college.streams.includes(streamFilter as StreamType)) return false;
      if (typeFilter !== 'All' && college.type !== typeFilter) return false;
      if (rankFilter === 'top10' && college.nirfRank > 10) return false;
      if (rankFilter === 'top25' && college.nirfRank > 25) return false;
      if (rankFilter === 'top50' && college.nirfRank > 50) return false;
      if (
        courseFilter !== 'All' &&
        !college.coursesOffered.some((c) => c.toLowerCase().includes(courseFilter.toLowerCase()))
      ) {
        return false;
      }
      if (!q) return true;
      return (
        college.name.toLowerCase().includes(q) ||
        college.shortName.toLowerCase().includes(q) ||
        college.city.toLowerCase().includes(q) ||
        college.state.toLowerCase().includes(q) ||
        college.acceptedExams.some((e) => e.toLowerCase().includes(q)) ||
        college.coursesOffered.some((c) => c.toLowerCase().includes(q))
      );
    }).sort((a, b) => a.nirfRank - b.nirfRank);
  }, [search, cityFilter, stateFilter, streamFilter, courseFilter, typeFilter, rankFilter]);

  const selectedColleges = useMemo(
    () => COLLEGES.filter((c) => compareCollegeIds.includes(c.id)),
    [compareCollegeIds]
  );

  const textsToTranslate = useMemo(() => {
    const items: string[] = [];
    filteredColleges.slice(0, 18).forEach((c) => {
      items.push(c.name, c.nirfCategory);
    });
    selectedColleges.forEach((c) => {
      items.push(c.name, c.nirfCategory);
    });
    return items;
  }, [filteredColleges, selectedColleges]);
  const tr = useAutoTranslate(textsToTranslate);

  const handleCompareClick = (collegeId: string) => {
    const res = toggleCompareCollege(collegeId);
    if (res.limitReached) {
      setCompareNotice('You can compare up to 3 colleges side by side. Remove one to add another.');
      setTimeout(() => setCompareNotice(null), 3500);
    } else {
      setCompareNotice(null);
    }
  };

  const hasActiveFilters =
    search !== '' ||
    cityFilter !== 'All' ||
    stateFilter !== 'All' ||
    streamFilter !== 'All' ||
    courseFilter !== 'All' ||
    typeFilter !== 'All' ||
    rankFilter !== 'All';

  const resetFilters = () => {
    setSearch('');
    setCityFilter('All');
    setStateFilter('All');
    setStreamFilter('All');
    setCourseFilter('All');
    setTypeFilter('All');
    setRankFilter('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-[#4F46E5]">{t('colleges.kicker')}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{t('colleges.title')}</h1>
          <p className="text-slate-600 text-sm sm:text-base">{t('colleges.subtitle')}</p>
        </div>
        <div className="w-full lg:w-96">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t('colleges.searchPlaceholder')}
            ariaLabel={t('colleges.title')}
            commandStyle
          />
        </div>
      </div>

      {isTranslating && (
        <p className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</p>
      )}

      {compareNotice && (
        <div role="status" className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-sm font-medium">
          {compareNotice}
        </div>
      )}

      <FilterPanel
        resultCount={filteredColleges.length}
        resultLabel={t('colleges.label')}
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
        groups={[
          {
            id: 'type',
            label: t('colleges.filterType'),
            value: typeFilter,
            onChange: setTypeFilter,
            variant: 'tabs',
            options: [
              { label: t('common.all'), value: 'All' },
              { label: t('common.government'), value: 'Government' },
              { label: t('common.private'), value: 'Private' },
            ],
          },
          {
            id: 'city',
            label: t('colleges.filterCity'),
            value: cityFilter,
            onChange: setCityFilter,
            variant: 'select',
            options: cityOptions,
          },
          {
            id: 'state',
            label: t('colleges.filterState'),
            value: stateFilter,
            onChange: setStateFilter,
            variant: 'select',
            options: stateOptions,
          },
          {
            id: 'stream',
            label: t('colleges.filterStream'),
            value: streamFilter,
            onChange: setStreamFilter,
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
            id: 'course',
            label: t('colleges.filterCourse'),
            value: courseFilter,
            onChange: setCourseFilter,
            variant: 'select',
            options: courseOptions,
          },
          {
            id: 'ranking',
            label: t('colleges.filterRanking'),
            value: rankFilter,
            onChange: setRankFilter,
            variant: 'select',
            options: [
              { label: t('colleges.allRankings'), value: 'All' },
              { label: t('colleges.top10'), value: 'top10' },
              { label: t('colleges.top25'), value: 'top25' },
              { label: t('colleges.top50'), value: 'top50' },
            ],
          },
        ]}
      />

      {filteredColleges.length === 0 ? (
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">{t('colleges.noMatchTitle')}</h2>
            <p className="text-sm text-slate-600">{t('colleges.noMatchDesc')}</p>
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
          {filteredColleges.map((college, idx) => {
            const isCompared = compareCollegeIds.includes(college.id);
            const isGov = college.type === 'Government';
            const barGradient = isGov
              ? 'from-blue-600 via-cyan-500 to-emerald-500'
              : 'from-violet-600 via-indigo-600 to-rose-500';
            const hoverGlow = isGov
              ? 'hover:border-blue-300 hover:shadow-[0_14px_34px_-10px_rgba(37,99,235,0.24)]'
              : 'hover:border-violet-300 hover:shadow-[0_14px_34px_-10px_rgba(124,58,237,0.24)]';

            return (
              <motion.article
                key={college.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.2, delay: (idx % 6) * 0.04 }}
                whileHover={{ y: -4 }}
                className={`group bg-white border border-slate-200/90 ${hoverGlow} rounded-2xl overflow-hidden flex flex-col transition-all`}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${barGradient}`} />

                <div className="relative">
                  <CollegeEmblem college={college} variant="card" />
                  <div className="absolute top-3 right-3">
                    <BookmarkButton type="colleges" itemId={college.id} itemLabel={college.shortName} compact />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className={isGov ? 'text-blue-700' : 'text-violet-700'}>
                        {tType(college.type)}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500 font-medium">{t('common.est')} {college.established}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-600 font-medium">
                        {college.streams.map((s) => tStream(s)).join(', ')}
                      </span>
                    </div>

                    <Link to={`/colleges/${college.id}`} className="block">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                        {tr(college.name)}
                      </h2>
                    </Link>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>
                        {college.city}, {college.state}
                      </span>
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {t('common.programs')}: {college.coursesOffered.slice(0, 3).join(', ')}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs tabular-nums">
                      <span className="text-slate-500">
                        {t('common.fees')}: <strong className="text-slate-900">{college.feesRange}</strong>
                      </span>
                      <span className="text-slate-500">
                        {t('common.median')}: <strong className="text-emerald-700">{college.placementMedian}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCompareClick(college.id)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                          isCompared
                            ? 'bg-gradient-to-r from-violet-50 to-indigo-50 border-indigo-300 text-[#4F46E5]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                        <span>{isCompared ? t('common.added') : t('common.compare')}</span>
                      </button>

                      <Link
                        to={`/colleges/${college.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 rounded-xl transition-opacity whitespace-nowrap"
                      >
                        <span>{t('common.details')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Floating Glassmorphic Comparison Dock */}
      <AnimatePresence>
        {selectedColleges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="sticky bottom-4 z-30 bg-white/85 backdrop-blur-xl border border-indigo-200/80 shadow-[0_18px_45px_-12px_rgba(79,70,229,0.28)] rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#4F46E5]">
                <Scale className="w-4 h-4" />
                <span>{t('common.compare')} ({selectedColleges.length}/3)</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {selectedColleges.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => handleCompareClick(col.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50/90 hover:bg-indigo-100 text-xs font-semibold text-indigo-950 rounded-lg transition-colors border border-indigo-200/60"
                  >
                    <span>{col.shortName}</span>
                    <X className="w-3.5 h-3.5 text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={clearCompareColleges}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {t('common.clear')}
              </button>
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                disabled={selectedColleges.length < 2}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:opacity-95 disabled:opacity-45 rounded-xl transition-opacity whitespace-nowrap shadow-sm"
              >
                {selectedColleges.length < 2 ? t('colleges.selectOneMore') : t('colleges.compareSideBySide')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Comparison Modal */}
      <AnimatePresence>
        {showCompareModal && selectedColleges.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('colleges.compareModalTitle')}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]" />
              <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{t('colleges.compareModalTitle')}</h2>
                  <p className="text-xs text-slate-500">{selectedColleges.length} {t('colleges.label')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCompareModal(false)}
                  aria-label="Close comparison"
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-auto p-6">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 pr-4 text-xs font-semibold text-slate-500 w-40">Criteria</th>
                      {selectedColleges.map((col) => (
                        <th key={col.id} className="py-3 px-4 font-bold text-slate-900 min-w-[200px]">
                          <Link
                            to={`/colleges/${col.id}`}
                            onClick={() => setShowCompareModal(false)}
                            className="hover:text-[#4F46E5] transition-colors"
                          >
                            {tr(col.name)}
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">Location</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 text-slate-800">{c.city}, {c.state}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">{t('colleges.filterType')}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 text-slate-800">{tType(c.type)} ({t('common.est')} {c.established})</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">{t('colleges.academicStreams')}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 text-slate-800">
                          {c.streams.map((s) => tStream(s)).join(', ')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">{t('colleges.filterRanking')}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 font-bold text-[#2563EB] tabular-nums">
                          {c.nirfRankDisplay || `#${c.nirfRank}`} ({tr(c.nirfCategory)})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">{t('colleges.annualTuition')}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 font-semibold text-slate-900 tabular-nums">{c.feesRange}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">{t('colleges.medianPlacement')}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 font-semibold text-emerald-700 tabular-nums">{c.placementMedian}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">{t('colleges.studentRating')}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 text-slate-800 tabular-nums">{c.rating.toFixed(1)} / 5.0</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">{t('colleges.acceptedExams')}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 text-slate-700">{c.acceptedExams.join(', ')}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-semibold text-slate-600">{t('colleges.programsOffered')}</td>
                      {selectedColleges.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 text-slate-700">{c.coursesOffered.join(', ')}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
