import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, CheckCircle2, ExternalLink, MapPin, Scale, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { COLLEGES } from '../data/colleges';
import BookmarkButton from '../components/BookmarkButton';
import CollegeEmblem from '../components/CollegeEmblem';
import { useAuth } from '../context/AuthContext';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const college = COLLEGES.find((c) => c.id === id);
  const { compareCollegeIds, toggleCompareCollege } = useAuth();
  const { t, tStream, tType, isTranslating } = useLanguage();

  const textsToTranslate = useMemo(() => {
    if (!college) return [];
    return [college.name, college.overview, college.nirfCategory, ...college.campusHighlights];
  }, [college]);
  const tr = useAutoTranslate(textsToTranslate);

  if (!college) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">College not found</h1>
        <Link
          to="/colleges"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('colleges.allColleges')}
        </Link>
      </div>
    );
  }

  const isCompared = compareCollegeIds.includes(college.id);
  const isGov = college.type === 'Government';
  const barGradient = isGov
    ? 'from-blue-600 via-cyan-500 to-emerald-500'
    : 'from-violet-600 via-indigo-600 to-rose-500';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/colleges"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#4F46E5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('colleges.allColleges')}</span>
        </Link>
        {isTranslating && <span className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</span>}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className={`h-2 w-full bg-gradient-to-r ${barGradient}`} />

        <CollegeEmblem college={college} variant="detail" />

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-2 tabular-nums">
                <span className={isGov ? 'text-blue-700' : 'text-violet-700'}>
                  {tType(college.type)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t('common.est')} {college.established}</span>
                <span aria-hidden="true">·</span>
                <span>{college.streams.map((s) => tStream(s)).join(', ')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{tr(college.name)}</h1>
              <p className="text-sm text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" aria-hidden="true" />
                <span>{college.city}, {college.state}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => toggleCompareCollege(college.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  isCompared
                    ? 'bg-gradient-to-r from-violet-50 to-indigo-50 border-indigo-200 text-[#4F46E5]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                <span>{isCompared ? t('common.added') : t('common.compare')}</span>
              </button>
              <BookmarkButton type="colleges" itemId={college.id} itemLabel={college.shortName} />
            </div>
          </div>

          <p className="text-base text-slate-700 leading-relaxed">{tr(college.overview)}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-100">
              <p className="text-xs text-slate-500">{t('colleges.annualTuition')}</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">{college.feesRange}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <p className="text-xs text-emerald-700 font-medium">{t('colleges.medianPlacement')}</p>
              <p className="text-lg font-bold text-emerald-800 tabular-nums mt-0.5">{college.placementMedian}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <p className="text-xs text-amber-800 font-medium">{t('colleges.studentRating')}</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5 inline-flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                {college.rating.toFixed(1)} / 5
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between">
              <p className="text-xs text-indigo-700 font-medium">{t('colleges.officialPortal')}</p>
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#4F46E5] hover:underline inline-flex items-center gap-1 mt-1"
              >
                <span>{t('common.visitSite')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.22 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs"
        >
          <h2 className="text-lg font-bold text-slate-900">{t('colleges.popularCoursesExams')}</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">{t('colleges.programsOffered')}</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {college.coursesOffered.map((course) => (
                  <li key={course} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-1">{t('colleges.acceptedExams')}</p>
              <p className="text-sm font-semibold text-slate-900">{college.acceptedExams.join(' · ')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.22, delay: 0.05 }}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs"
        >
          <h2 className="text-lg font-bold text-slate-900">{t('colleges.campusHighlights')}</h2>
          <ul className="space-y-3">
            {college.campusHighlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{tr(item)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
