import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  Compass,
  GraduationCap,
  MessageSquare,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import SearchBar from '../components/SearchBar';
import CollegeEmblem from '../components/CollegeEmblem';
import { CAREERS } from '../data/careers';
import { COURSES } from '../data/courses';
import { COLLEGES } from '../data/colleges';
import { EXAMS } from '../data/exams';
import { SCHOLARSHIPS } from '../data/scholarships';
import { TESTIMONIALS } from '../data/testimonials';
import { getDaysUntil, getStreamTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

interface SearchResultItem {
  id: string;
  type: 'Career' | 'Course' | 'College' | 'Exam';
  title: string;
  subtitle: string;
  to: string;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroImgError, setHeroImgError] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const { t, tStream, tType } = useLanguage();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const inputEl = searchWrapperRef.current?.querySelector('input');
        inputEl?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const searchResults = useMemo<SearchResultItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const matchedCareers: SearchResultItem[] = CAREERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.stream.toLowerCase().includes(q) ||
        c.interestArea.toLowerCase().includes(q)
    )
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        type: 'Career',
        title: c.title,
        subtitle: `${c.stream} · ${c.averageSalary}`,
        to: `/careers/${c.id}`,
      }));

    const matchedCourses: SearchResultItem[] = COURSES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.stream.toLowerCase().includes(q)
    )
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        type: 'Course',
        title: c.shortName,
        subtitle: `${c.level} · ${c.duration} · ${c.feesRange}`,
        to: `/courses/${c.id}`,
      }));

    const matchedColleges: SearchResultItem[] = COLLEGES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    )
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        type: 'College',
        title: c.shortName,
        subtitle: `${c.city}, ${c.state} · NIRF ${c.nirfRankDisplay || `#${c.nirfRank}`}`,
        to: `/colleges/${c.id}`,
      }));

    const matchedExams: SearchResultItem[] = EXAMS.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.fullName.toLowerCase().includes(q) ||
        e.stream.toLowerCase().includes(q)
    )
      .slice(0, 3)
      .map((e) => ({
        id: e.id,
        type: 'Exam',
        title: e.name,
        subtitle: `${e.examDate} · ${e.conductingBody}`,
        to: `/exams?highlight=${e.id}`,
      }));

    return [...matchedCareers, ...matchedCourses, ...matchedColleges, ...matchedExams].slice(0, 8);
  }, [searchQuery]);

  const popularCareers = CAREERS.slice(0, 5);
  const trendingCourses = COURSES.slice(0, 4);
  const topColleges = useMemo(
    () => [
      COLLEGES.find((c) => c.id === 'iisc-bengaluru') || COLLEGES[0],
      COLLEGES.find((c) => c.id === 'iit-bombay') || COLLEGES[1],
      COLLEGES.find((c) => c.id === 'iim-bangalore') || COLLEGES[2],
      COLLEGES.find((c) => c.id === 'nlsiu-bengaluru') || COLLEGES[3],
    ],
    []
  );
  const upcomingExams = EXAMS.slice(0, 4);
  const featuredScholarships = SCHOLARSHIPS.slice(0, 4);

  const textsToTranslate = useMemo(() => {
    const list: string[] = [];
    popularCareers.forEach((c) => list.push(c.title, c.shortDesc, c.interestArea));
    trendingCourses.forEach((c) => list.push(c.title, c.overview));
    TESTIMONIALS.forEach((item) => list.push(item.quote, item.outcome, item.role));
    return list;
  }, [popularCareers, trendingCourses]);
  const tr = useAutoTranslate(textsToTranslate);

  const openCounselor = () => {
    window.dispatchEvent(new CustomEvent('open-counselor'));
  };

  return (
    <div className="space-y-24">
      {/* Dynamic Hero Centerpiece */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white/60">
        <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -left-24 w-[420px] h-[420px] rounded-full bg-indigo-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-0 w-[380px] h-[380px] rounded-full bg-cyan-400/15 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-7 flex flex-col justify-center space-y-6"
            >
              <div className="space-y-4">
                <p className="text-sm font-semibold bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
                  {t('home.kicker')}
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.08] max-w-2xl text-slate-900">
                  {t('home.heroTitle1')}{' '}
                  <span className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent animate-gradient-text">
                    {t('home.heroTitle2')}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  {t('home.heroSubtitle')}
                </p>
              </div>

              {/* Command-Palette Unified Search Bar */}
              <div ref={searchWrapperRef} className="relative max-w-xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t('home.searchPlaceholder')}
                  ariaLabel={t('common.search')}
                  showButton
                  buttonLabel={t('common.explore')}
                  commandStyle
                />

                {searchQuery.trim() && (
                  <div className="absolute left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl shadow-indigo-950/10 z-30 overflow-hidden">
                    {searchResults.length > 0 ? (
                      <ul className="divide-y divide-slate-100">
                        {searchResults.map((item) => (
                          <li key={`${item.type}-${item.id}`}>
                            <Link
                              to={item.to}
                              onClick={() => setSearchQuery('')}
                              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-indigo-50/60 transition-colors"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {item.title}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                              </div>
                              <span className="text-xs font-semibold text-[#4F46E5] shrink-0">
                                {item.type}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-5 text-sm text-slate-500 text-center">
                        No matches for &ldquo;{searchQuery}&rdquo;. Try &ldquo;Software&rdquo;, &ldquo;IISc&rdquo;, or &ldquo;NEET&rdquo;.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  to="/careers"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                >
                  <span>{t('home.exploreCareers')}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#4F46E5] bg-white/90 hover:bg-indigo-50/80 border border-indigo-200 rounded-xl shadow-xs transition-all hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                >
                  <Compass className="w-4 h-4" aria-hidden="true" />
                  <span>{t('home.takeQuiz')}</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Bento Visual & Floating Interactive Stat Cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="lg:col-span-5 flex flex-col gap-4"
            >
              <div className="relative flex-1 min-h-[260px] sm:min-h-[300px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl shadow-indigo-950/10 bg-slate-100">
                {!heroImgError ? (
                  <img
                    src="/src/assets/images/hero_career_guidance_1795426217016.jpg"
                    alt="Indian university students collaborating on career planning in a sunlit modern library"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col items-center justify-center p-8 text-center">
                    <GraduationCap className="w-12 h-12 text-[#4F46E5] mb-3" />
                    <p className="text-sm font-semibold text-slate-800">CareerPath Guidance Portal</p>
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-cyan-200">{t('home.cycleLabel')}</p>
                    <p className="text-sm font-bold font-display">{t('home.cycleTitle')}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold tabular-nums bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1 rounded-lg">
                    4 {t('common.streams')}
                  </span>
                </div>
              </div>

              {/* Floating Interactive Bento Stat Row */}
              <div className="grid grid-cols-3 gap-3">
                <Link
                  to="/careers"
                  className="group bg-white/85 backdrop-blur-xl border border-slate-200/90 hover:border-blue-300 rounded-2xl p-3.5 shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white inline-flex items-center justify-center mb-2">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-base font-bold text-slate-900 font-display tabular-nums">{CAREERS.length}+</p>
                  <p className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700 leading-tight">
                    {t('home.statRoadmaps')}
                  </p>
                </Link>

                <Link
                  to="/colleges"
                  className="group bg-white/85 backdrop-blur-xl border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-3.5 shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 text-white inline-flex items-center justify-center mb-2">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <p className="text-base font-bold text-slate-900 font-display tabular-nums">{COLLEGES.length}+</p>
                  <p className="text-[11px] font-medium text-slate-600 group-hover:text-emerald-700 leading-tight">
                    {t('home.statColleges')}
                  </p>
                </Link>

                <button
                  type="button"
                  onClick={openCounselor}
                  className="group text-left bg-white/85 backdrop-blur-xl border border-slate-200/90 hover:border-violet-300 rounded-2xl p-3.5 shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-rose-500 text-white inline-flex items-center justify-center mb-2">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <p className="text-base font-bold text-slate-900 font-display">24/7</p>
                  <p className="text-[11px] font-medium text-slate-600 group-hover:text-violet-700 leading-tight">
                    {t('home.statCounselor')}
                  </p>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('home.howTitle')}</h2>
            <p className="text-slate-600 mt-1.5 text-sm sm:text-base">{t('home.howSubtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25 }}
            whileHover={{ y: -4 }}
            className="md:col-span-5 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/70 border border-indigo-200/70 rounded-2xl p-7 space-y-4 shadow-xs hover:shadow-lg hover:shadow-indigo-900/5 transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white inline-flex items-center justify-center shadow-sm shadow-blue-600/25">
              <Compass className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#4F46E5] tabular-nums">{t('home.step1Tag')}</p>
            <h3 className="text-xl font-bold text-slate-900">{t('home.step1Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('home.step1Desc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25, delay: 0.07 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 bg-gradient-to-br from-violet-50/90 via-white to-rose-50/50 border border-violet-200/70 rounded-2xl p-7 space-y-4 shadow-xs hover:shadow-lg hover:shadow-violet-900/5 transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#E11D48] text-white inline-flex items-center justify-center shadow-sm shadow-violet-600/25">
              <Scale className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#7C3AED] tabular-nums">{t('home.step2Tag')}</p>
            <h3 className="text-xl font-bold text-slate-900">{t('home.step2Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('home.step2Desc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25, delay: 0.14 }}
            whileHover={{ y: -4 }}
            className="md:col-span-3 bg-gradient-to-br from-cyan-50/90 via-white to-emerald-50/60 border border-cyan-200/70 rounded-2xl p-7 space-y-4 shadow-xs hover:shadow-lg hover:shadow-cyan-900/5 transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#059669] text-white inline-flex items-center justify-center shadow-sm shadow-cyan-600/25">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-teal-700 tabular-nums">{t('home.step3Tag')}</p>
            <h3 className="text-xl font-bold text-slate-900">{t('home.step3Title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{t('home.step3Desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Popular Careers Asymmetric Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('home.popularCareers')}</h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">{t('home.popularCareersDesc')}</p>
          </div>
          <Link
            to="/careers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] whitespace-nowrap shrink-0"
          >
            <span>{t('home.allCareersLink')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {popularCareers.map((career, index) => {
            const theme = getStreamTheme(career.stream);
            const spanClass = index < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.22, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className={spanClass}
              >
                <Link
                  to={`/careers/${career.id}`}
                  className={`group h-full bg-white border border-slate-200/90 ${theme.borderHover} ${theme.glowShadow} rounded-2xl overflow-hidden flex flex-col justify-between transition-all`}
                >
                  <div>
                    <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradientBar}`} />
                    <div className="p-6 space-y-3">
                      <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                        <span className={`${theme.textAccent} font-semibold`}>{tStream(career.stream)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{tr(career.interestArea)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                        {tr(career.title)}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {tr(career.shortDesc)}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 tabular-nums">{career.averageSalary}</span>
                    <span className={`${theme.textAccent} font-semibold inline-flex items-center gap-1`}>
                      {t('home.viewRoadmap')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trending Courses Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('home.trendingCourses')}</h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">{t('home.trendingCoursesDesc')}</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] whitespace-nowrap shrink-0"
          >
            <span>{t('home.browseCourses')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCourses.map((course, index) => {
            const theme = getStreamTheme(course.stream);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.22, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/courses/${course.id}`}
                  className={`group h-full bg-white border border-slate-200/90 ${theme.borderHover} ${theme.glowShadow} rounded-2xl overflow-hidden flex flex-col justify-between transition-all`}
                >
                  <div>
                    <div className={`px-5 py-3.5 ${theme.softBg} border-b border-slate-100 flex items-center justify-between`}>
                      <span className={`w-8 h-8 rounded-lg ${theme.iconBg} text-white inline-flex items-center justify-center`}>
                        <BookOpen className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-semibold text-slate-600 tabular-nums">
                        {course.level} · {course.duration}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                        {tr(course.title)}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {tr(course.overview)}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-3.5 border-t border-slate-100 text-xs font-semibold text-slate-800 tabular-nums">
                    {t('common.fees')}: {course.feesRange}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Top Colleges (Typographic Crest Fallback — Zero Generic Stock Photos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('home.topColleges')}</h2>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">{t('home.topCollegesDesc')}</p>
          </div>
          <Link
            to="/colleges"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] whitespace-nowrap shrink-0"
          >
            <span>{t('home.exploreCompare')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topColleges.map((college, index) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.22, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={`/colleges/${college.id}`}
                className="group h-full bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-[0_12px_32px_-8px_rgba(79,70,229,0.18)] rounded-2xl overflow-hidden flex flex-col transition-all"
              >
                <CollegeEmblem college={college} variant="compact" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#4F46E5]">
                      {tType(college.type)} {t('common.institution')}
                    </p>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                      {college.shortName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {college.streams.map((s) => tStream(s)).join(', ')}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 tabular-nums">
                    <span>{college.feesRange}</span>
                    <span className="font-semibold text-slate-900">{t('common.median')} {college.placementMedian}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Exams & Scholarships Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white inline-flex items-center justify-center">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">{t('home.upcomingExams')}</h2>
              </div>
              <Link to="/exams" className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap">
                {t('home.fullTimeline')}
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingExams.map((exam) => {
                const daysLeft = getDaysUntil(exam.isoDate);
                return (
                  <Link
                    key={exam.id}
                    to={`/exams?highlight=${exam.id}`}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-blue-50/40 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{exam.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {exam.conductingBody} · {tStream(exam.stream)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-[#2563EB] tabular-nums">{exam.examDate}</p>
                      <p className="text-[11px] font-mono font-semibold text-indigo-700 tabular-nums">
                        {daysLeft}d
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-rose-500 text-white inline-flex items-center justify-center">
                  <Award className="w-4 h-4" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">{t('home.activeScholarships')}</h2>
              </div>
              <Link to="/scholarships" className="text-xs font-semibold text-[#7C3AED] hover:underline whitespace-nowrap">
                {t('home.viewSchemes')}
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {featuredScholarships.map((sch) => (
                <Link
                  key={sch.id}
                  to="/scholarships"
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-violet-50/40 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{sch.title}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {sch.provider} · {sch.level}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-900 tabular-nums">{sch.amount}</p>
                    <p
                      className={`text-xs tabular-nums ${
                        sch.closingSoon ? 'text-amber-700 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {sch.closingSoon ? `${t('scholarships.closingSoon')} · ${sch.deadline}` : sch.deadline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('home.successStories')}</h2>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">{t('home.successStoriesDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.22, delay: idx * 0.06 }}
              className="bg-white/95 border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xs"
            >
              <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{tr(item.quote)}&rdquo;</p>
              <div className="pt-4 border-t border-slate-100 space-y-1">
                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {tr(item.role)} · {item.institution}
                </p>
                <p className="text-xs font-semibold text-[#4F46E5] pt-1">{tr(item.outcome)}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Final Quiz Call-to-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-800">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl"
          />
          <div className="relative lg:col-span-8 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold">{t('home.ctaTitle')}</h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t('home.ctaDesc')}
            </p>
          </div>
          <div className="relative lg:col-span-4 flex lg:justify-end">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span>{t('home.startQuiz')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
