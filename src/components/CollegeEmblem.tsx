import { useState } from 'react';
import { Landmark, Star } from 'lucide-react';
import { College } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CollegeEmblemProps {
  college: College;
  variant?: 'card' | 'detail' | 'compact';
}

export default function CollegeEmblem({ college, variant = 'card' }: CollegeEmblemProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const { t, tType, tStream } = useLanguage();
  const isGov = college.type === 'Government';
  const nirfLabel = college.nirfRankDisplay || `#${college.nirfRank}`;

  // Show verified photo ONLY if an authentic campus photo is provided and loads cleanly
  if (college.image && !imgFailed) {
    if (variant === 'detail') {
      return (
        <div className="h-56 sm:h-72 bg-slate-100 relative overflow-hidden">
          <img
            src={college.image}
            alt={college.name}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/15 to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-2.5 text-xs text-white">
            <span className="px-3 py-1 rounded-lg bg-slate-950/75 backdrop-blur-md font-bold tabular-nums border border-white/15">
              {t('common.nirf')} {nirfLabel} · {college.nirfCategory}
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-950/75 backdrop-blur-md font-semibold border border-white/15">
              {tType(college.type)} {t('common.institution')}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
        <img
          src={college.image}
          alt={college.name}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/15 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-xs text-white">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md font-bold tabular-nums border border-white/15">
            {t('common.nirf')} {nirfLabel}
          </span>
          {variant === 'card' && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md font-semibold inline-flex items-center gap-1 tabular-nums border border-white/15">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              {college.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Clean typographic crest + minimalist campus icon fallback when no verified campus photo exists
  const surfaceClasses = isGov
    ? 'bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-50/70 border-b border-slate-200/80'
    : 'bg-gradient-to-br from-slate-50 via-violet-50/55 to-slate-100/80 border-b border-slate-200/80';

  const emblemBoxClasses = isGov
    ? 'bg-white border-blue-200/80 text-[#1E3A8A]'
    : 'bg-white border-violet-200/80 text-[#4C1D95]';

  const iconTint = isGov ? 'text-[#2563EB]' : 'text-[#7C3AED]';

  if (variant === 'detail') {
    return (
      <div className={`${surfaceClasses} relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10`}>
        <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-35 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border shadow-xs flex flex-col items-center justify-center shrink-0 ${emblemBoxClasses}`}
            >
              <Landmark className={`w-5 h-5 mb-1 ${iconTint}`} aria-hidden="true" />
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight leading-none">
                {college.monogram}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-600 flex flex-wrap items-center gap-2 tabular-nums">
                <span className={isGov ? 'text-blue-700' : 'text-violet-700'}>
                  {t('common.nirf')} {nirfLabel} · {college.nirfCategory}
                </span>
                <span aria-hidden="true">·</span>
                <span>{tType(college.type)} {t('common.institution')}</span>
                <span aria-hidden="true">·</span>
                <span>{t('common.est')} {college.established}</span>
              </div>
              <p className="text-sm font-medium text-slate-600">
                {college.streams.map((s) => tStream(s)).join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${surfaceClasses} relative overflow-hidden ${
        variant === 'compact' ? 'px-5 py-5' : 'px-6 py-5'
      }`}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl border shadow-xs flex flex-col items-center justify-center shrink-0 ${emblemBoxClasses}`}
          >
            <Landmark className={`w-3.5 h-3.5 mb-0.5 ${iconTint}`} aria-hidden="true" />
            <span className="font-display font-extrabold text-[11px] tracking-tight leading-none">
              {college.monogram}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 tabular-nums truncate">
              {t('common.nirf')} {nirfLabel} · {college.nirfCategory}
            </p>
            <p className="text-[11px] font-medium text-slate-500 truncate">
              {college.city}, {college.state}
            </p>
          </div>
        </div>

        {variant === 'card' && (
          <span className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1 tabular-nums shrink-0 pr-10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {college.rating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
