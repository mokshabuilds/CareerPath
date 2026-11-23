import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Briefcase } from 'lucide-react';
import { COURSES } from '../data/courses';
import { CAREERS } from '../data/careers';
import { EXAMS } from '../data/exams';
import BookmarkButton from '../components/BookmarkButton';
import { getStreamTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find((c) => c.id === id);
  const { t, tStream, isTranslating } = useLanguage();

  const careerOptions = useMemo(
    () => (course ? CAREERS.filter((c) => course.careerOptionIds.includes(c.id)) : []),
    [course]
  );
  const acceptedExams = useMemo(
    () => (course ? EXAMS.filter((e) => course.entranceExamIds.includes(e.id)) : []),
    [course]
  );

  const textsToTranslate = useMemo(() => {
    if (!course) return [];
    return [
      course.title,
      course.overview,
      course.eligibility,
      ...course.highlights,
      ...careerOptions.map((c) => c.title),
    ];
  }, [course, careerOptions]);
  const tr = useAutoTranslate(textsToTranslate);

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Course not found</h1>
        <p className="text-slate-600 text-sm">The requested course could not be found.</p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('courses.allCourses')}
        </Link>
      </div>
    );
  }

  const theme = getStreamTheme(course.stream);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#4F46E5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('courses.allCourses')}</span>
        </Link>
        {isTranslating && <span className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</span>}
      </div>

      <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className={`h-2 w-full bg-gradient-to-r ${theme.gradientBar}`} />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                <span className={theme.textAccent}>{course.level}</span>
                <span aria-hidden="true">·</span>
                <span>{tStream(course.stream)}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{tr(course.title)}</h1>
            </div>
            <BookmarkButton type="courses" itemId={course.id} itemLabel={course.shortName} />
          </div>

          <p className="text-base text-slate-700 leading-relaxed">{tr(course.overview)}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">Duration</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">{course.duration}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('courses.estimatedFees')}</p>
              <p className={`text-lg font-bold ${theme.textAccent} tabular-nums mt-0.5`}>{course.feesRange}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('exams.eligibility')}</p>
              <p className="text-sm font-medium text-slate-800 mt-1">{tr(course.eligibility)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">{t('courses.programHighlights')}</h2>
          <ul className="space-y-3">
            {course.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{tr(item)}</span>
              </li>
            ))}
          </ul>

          {acceptedExams.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-xs font-semibold text-slate-500">{t('careers.keyExams')}</p>
              <div className="flex flex-wrap gap-2">
                {acceptedExams.map((exam) => (
                  <Link
                    key={exam.id}
                    to={`/exams?highlight=${exam.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    {exam.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#7C3AED]" aria-hidden="true" />
            <span>{t('courses.careerOptions')}</span>
          </h2>
          <div className="divide-y divide-slate-100">
            {careerOptions.map((career) => (
              <Link
                key={career.id}
                to={`/careers/${career.id}`}
                className="py-3 flex items-center justify-between gap-3 hover:text-[#4F46E5] transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{tr(career.title)}</p>
                  <p className="text-xs text-slate-500 tabular-nums">{career.averageSalary}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
