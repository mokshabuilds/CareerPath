import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, CheckCircle2, GraduationCap, TrendingUp } from 'lucide-react';
import { CAREERS } from '../data/careers';
import { COURSES } from '../data/courses';
import { EXAMS } from '../data/exams';
import BookmarkButton from '../components/BookmarkButton';
import { getStreamTheme } from '../utils/streamStyles';
import { useAutoTranslate, useLanguage } from '../context/LanguageContext';

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const career = CAREERS.find((c) => c.id === id);
  const { t, tStream, isTranslating } = useLanguage();

  const recommendedCourses = useMemo(
    () => (career ? COURSES.filter((c) => career.recommendedCourseIds.includes(c.id)) : []),
    [career]
  );
  const recommendedExams = useMemo(
    () => (career ? EXAMS.filter((e) => career.recommendedExamIds.includes(e.id)) : []),
    [career]
  );

  const textsToTranslate = useMemo(() => {
    if (!career) return [];
    return [
      career.title,
      career.interestArea,
      career.overview,
      career.eligibility,
      career.growthOutlook,
      career.pathAfter10th,
      career.pathAfter12th,
      career.futureScope,
      ...career.requiredSkills,
      ...recommendedCourses.map((c) => c.title),
    ];
  }, [career, recommendedCourses]);
  const tr = useAutoTranslate(textsToTranslate);

  if (!career) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Career path not found</h1>
        <p className="text-slate-600 text-sm">
          The career profile you requested could not be found in our directory.
        </p>
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('careers.allCareers')}
        </Link>
      </div>
    );
  }

  const theme = getStreamTheme(career.stream);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#4F46E5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('careers.allCareers')}</span>
        </Link>
        {isTranslating && <span className="text-xs font-medium text-[#4F46E5]">{t('common.translating')}</span>}
      </div>

      {/* Hero Header Card */}
      <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className={`h-2 w-full bg-gradient-to-r ${theme.gradientBar}`} />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                <span className={theme.textAccent}>{tStream(career.stream)}</span>
                <span aria-hidden="true">·</span>
                <span>{tr(career.interestArea)}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{tr(career.title)}</h1>
            </div>
            <BookmarkButton type="careers" itemId={career.id} itemLabel={career.title} />
          </div>

          <p className="text-base text-slate-700 leading-relaxed">{tr(career.overview)}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">{t('careers.avgComp')}</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">{career.averageSalary}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Growth Outlook</p>
              <p className={`text-sm font-semibold ${theme.textAccent} mt-1 flex items-center gap-1.5`}>
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>{tr(career.growthOutlook)}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('exams.eligibility')}</p>
              <p className="text-sm font-medium text-slate-800 mt-1">{tr(career.eligibility)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Pathway After 10th & 12th */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`border border-slate-200/80 rounded-2xl p-6 space-y-2.5 ${theme.softBg}`}>
          <p className={`text-xs font-semibold ${theme.textAccent}`}>01 · Class 10</p>
          <h2 className="text-lg font-bold text-slate-900">{t('careers.pathAfter10')}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{tr(career.pathAfter10th)}</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-2.5">
          <p className="text-xs font-semibold text-[#7C3AED]">02 · Class 12</p>
          <h2 className="text-lg font-bold text-slate-900">{t('careers.pathAfter12')}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{tr(career.pathAfter12th)}</p>
        </div>
      </section>

      {/* Skills, Top Recruiters & Future Scope */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">{t('careers.requiredSkills')}</h2>
          <ul className="space-y-2.5">
            {career.requiredSkills.map((skill) => (
              <li key={skill} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{tr(skill)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
            <span>{t('careers.topRecruiters')}</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{tr(career.futureScope)}</p>
          <div className="pt-2">
            <p className="text-sm font-medium text-slate-800">{career.topRecruiters.join(' · ')}</p>
          </div>
        </div>
      </section>

      {/* Recommended Courses & Entrance Exams */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
            <span>{t('careers.recommendedCourses')}</span>
          </h2>
          {recommendedCourses.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recommendedCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="py-3 flex items-center justify-between gap-3 hover:text-[#4F46E5] transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{tr(course.title)}</p>
                    <p className="text-xs text-slate-500">
                      {course.level} · {course.duration} · {course.feesRange}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Check Courses directory for related degree pathways.</p>
          )}
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">{t('careers.keyExams')}</h2>
          {recommendedExams.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recommendedExams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/exams?highlight=${exam.id}`}
                  className="py-3 flex items-center justify-between gap-3 hover:text-[#4F46E5] transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{exam.name}</p>
                    <p className="text-xs text-slate-500">
                      {exam.examDate} · {exam.conductingBody}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Direct merit admission or institutional screening applies.</p>
          )}
        </div>
      </section>
    </div>
  );
}
