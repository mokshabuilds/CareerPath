import { RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export interface FilterGroupOption {
  label: string;
  value: string;
}

export interface FilterGroupConfig {
  id: string;
  label: string;
  value: string;
  options: FilterGroupOption[];
  onChange: (value: string) => void;
  variant?: 'tabs' | 'select';
}

interface FilterPanelProps {
  groups: FilterGroupConfig[];
  onReset?: () => void;
  hasActiveFilters?: boolean;
  resultCount?: number;
  resultLabel?: string;
}

export default function FilterPanel({
  groups,
  onReset,
  hasActiveFilters = false,
  resultCount,
  resultLabel = 'results',
}: FilterPanelProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {groups.map((group) => (
            <div key={group.id} className="space-y-1.5">
              <label
                htmlFor={group.variant === 'select' ? `filter-${group.id}` : undefined}
                className="block text-xs font-semibold text-slate-500"
              >
                {group.label}
              </label>

              {group.variant === 'tabs' ? (
                <div
                  role="group"
                  aria-label={group.label}
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60"
                >
                  {group.options.map((opt) => {
                    const active = group.value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => group.onChange(opt.value)}
                        className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                          active ? 'text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId={`filter-tab-${group.id}`}
                            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-xs"
                          />
                        )}
                        <span className="relative z-10">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <select
                  id={`filter-${group.id}`}
                  value={group.value}
                  onChange={(e) => group.onChange(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-[#4F46E5] focus:bg-white outline-none transition-colors"
                >
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {typeof resultCount === 'number' && (
            <span className="text-xs font-semibold text-slate-600 tabular-nums">
              {t('common.showing')} {resultCount} {resultLabel}
            </span>
          )}
          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              {t('common.reset')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
