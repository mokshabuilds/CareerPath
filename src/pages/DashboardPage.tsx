import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, Compass, LogOut, Sparkles, Trash2, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { CAREERS } from '../data/careers';
import { COURSES } from '../data/courses';
import { COLLEGES } from '../data/colleges';
import { SCHOLARSHIPS } from '../data/scholarships';
import { getStreamTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function DashboardPage() {
  const { user, bookmarks, quizResults, toggleBookmark, logout } = useAuth();
  const navigate = useNavigate();
  const { t, tStream } = useLanguage();

  const savedCareers = useMemo(
    () => CAREERS.filter((c) => bookmarks.careers.includes(c.id)),
    [bookmarks.careers]
  );
  const savedCourses = useMemo(
    () => COURSES.filter((c) => bookmarks.courses.includes(c.id)),
    [bookmarks.courses]
  );
  const savedColleges = useMemo(
    () => COLLEGES.filter((c) => bookmarks.colleges.includes(c.id)),
    [bookmarks.colleges]
  );
  const savedScholarships = useMemo(
    () => SCHOLARSHIPS.filter((s) => bookmarks.scholarships.includes(s.id)),
    [bookmarks.scholarships]
  );

  const recommendedCareers = useMemo(() => {
    if (!user?.interests || user.interests.length === 0) {
      return CAREERS.slice(0, 3);
    }
    const matched = CAREERS.filter((c) => user.interests.includes(c.interestArea));
    return (matched.length > 0 ? matched : CAREERS).slice(0, 3);
  }, [user]);

  const textsToTranslate = useMemo(() => {
    const list: string[] = [];
    recommendedCareers.forEach((c) => list.push(c.title, c.shortDesc, c.interestArea));
    savedCareers.forEach((c) => list.push(c.title));
    savedCourses.forEach((c) => list.push(c.title));
    savedColleges.forEach((c) => list.push(c.name));
    savedScholarships.forEach((s) => list.push(s.title));
    return list;
  }, [recommendedCareers, savedCareers, savedCourses, savedColleges, savedScholarships]);
  const tr = useAutoTranslate(textsToTranslate);

  const totalBookmarks =
    savedCareers.length + savedCourses.length + savedColleges.length + savedScholarships.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]" />
        <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white font-display font-bold text-lg inline-flex items-center justify-center shrink-0 shadow-sm">
              {initials || 'CP'}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#7C3AED]">{t('dashboard.kicker')}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {t('dashboard.welcome')}, {user.name}
              </h1>
              <p className="text-sm text-slate-600">
                {user.currentClassOrDegree || user.qualification}
                {user.interests.length > 0 && ` · ${user.interests.join(', ')}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{t('dashboard.editProfile')}</span>
            </Link>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 rounded-xl transition-opacity shadow-xs"
            >
              <Compass className="w-4 h-4" />
              <span>{t('dashboard.takeQuiz')}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('dashboard.logout')}</span>
            </button>
          </div>
        </div>
      </motion.section>

      {/* Recommended Careers Based on Interests */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4F46E5]" aria-hidden="true" />
              <span>{t('dashboard.recommendedTitle')}</span>
            </h2>
          </div>
          <Link to="/profile" className="text-xs font-semibold text-[#4F46E5] hover:underline whitespace-nowrap">
            {t('dashboard.editProfile')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCareers.map((career, idx) => {
            const theme = getStreamTheme(career.stream);
            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/careers/${career.id}`}
                  className={`group h-full bg-white border border-slate-200/90 ${theme.borderHover} ${theme.glowShadow} rounded-2xl overflow-hidden flex flex-col justify-between transition-all`}
                >
                  <div>
                    <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradientBar}`} />
                    <div className="p-6 space-y-2">
                      <p className={`text-xs font-semibold ${theme.textAccent}`}>
                        {tStream(career.stream)} · {tr(career.interestArea)}
                      </p>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                        {tr(career.title)}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{tr(career.shortDesc)}</p>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 tabular-nums">{career.averageSalary}</span>
                    <span className={`${theme.textAccent} font-semibold inline-flex items-center gap-1`}>
                      {t('common.explore')} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Saved Bookmarks & Quiz Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#7C3AED]" />
              <span>{t('dashboard.savedBookmarks')} ({totalBookmarks})</span>
            </h2>
          </div>

          {totalBookmarks === 0 ? (
            <div className="py-10 text-center space-y-3 bg-slate-50/80 rounded-xl border border-slate-100 px-4">
              <p className="text-sm font-semibold text-slate-800">No bookmarks saved yet</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Link to="/careers" className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#4F46E5] hover:border-indigo-200">
                  {t('nav.careers')}
                </Link>
                <Link to="/colleges" className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-[#4F46E5] hover:border-indigo-200">
                  {t('nav.colleges')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {savedCareers.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500">{t('nav.careers')}</h3>
                  <ul className="divide-y divide-slate-100">
                    {savedCareers.map((item) => (
                      <li key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <Link to={`/careers/${item.id}`} className="text-sm font-semibold text-slate-900 hover:text-[#4F46E5]">
                          {tr(item.title)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleBookmark('careers', item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {savedCourses.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500">{t('nav.courses')}</h3>
                  <ul className="divide-y divide-slate-100">
                    {savedCourses.map((item) => (
                      <li key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <Link to={`/courses/${item.id}`} className="text-sm font-semibold text-slate-900 hover:text-[#4F46E5]">
                          {tr(item.title)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleBookmark('courses', item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {savedColleges.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500">{t('nav.colleges')}</h3>
                  <ul className="divide-y divide-slate-100">
                    {savedColleges.map((item) => (
                      <li key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <Link to={`/colleges/${item.id}`} className="text-sm font-semibold text-slate-900 hover:text-[#4F46E5]">
                          {tr(item.name)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleBookmark('colleges', item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {savedScholarships.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500">{t('nav.scholarships')}</h3>
                  <ul className="divide-y divide-slate-100">
                    {savedScholarships.map((item) => (
                      <li key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <Link to="/scholarships" className="text-sm font-semibold text-slate-900 hover:text-[#4F46E5]">
                          {tr(item.title)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleBookmark('scholarships', item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Saved Quiz Results */}
        <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{t('dashboard.quizHistory')}</h2>
            <Link to="/quiz" className="text-xs font-semibold text-[#7C3AED] hover:underline">
              {t('dashboard.takeQuiz')}
            </Link>
          </div>

          {quizResults.length === 0 ? (
            <div className="py-10 text-center space-y-3 bg-slate-50/80 rounded-xl border border-slate-100 px-4">
              <p className="text-sm font-semibold text-slate-800">No quiz attempts saved yet</p>
              <p className="text-xs text-slate-500">
                Complete the 12-question Career Assessment Quiz to store your top 3 recommendations here.
              </p>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-xl"
              >
                Start Quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quizResults.map((attempt, idx) => {
                const matchedCareers = attempt.topCareerIds
                  .map((cid) => CAREERS.find((c) => c.id === cid))
                  .filter(Boolean);
                return (
                  <div key={attempt.id} className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                      <span className="font-semibold text-slate-800">Attempt #{quizResults.length - idx}</span>
                      <span>{new Date(attempt.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Top traits: {attempt.dominantTraits.join(', ')}
                    </p>
                    <ul className="space-y-1 pt-1">
                      {matchedCareers.map((career, rankIdx) => (
                        <li key={career!.id} className="text-sm font-semibold">
                          <Link to={`/careers/${career!.id}`} className="text-[#4F46E5] hover:underline">
                            {rankIdx + 1}. {career!.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
