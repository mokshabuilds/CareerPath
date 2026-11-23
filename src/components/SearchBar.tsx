import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  ariaLabel?: string;
  className?: string;
  showButton?: boolean;
  buttonLabel?: string;
  commandStyle?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search careers, courses, colleges, exams...',
  onSubmit,
  ariaLabel = 'Search',
  className = '',
  showButton = false,
  buttonLabel = 'Search',
  commandStyle = false,
}: SearchBarProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleFormSubmit} className={`relative group ${className}`}>
      {commandStyle && (
        <div
          aria-hidden="true"
          className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#2563EB]/30 via-[#7C3AED]/30 to-[#06B6D4]/30 blur-md opacity-70 group-focus-within:opacity-100 transition-opacity pointer-events-none"
        />
      )}
      <div
        className={`relative flex items-center gap-2 ${
          commandStyle
            ? 'p-1.5 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-lg shadow-indigo-950/5'
            : ''
        }`}
      >
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-slate-400 group-focus-within:text-[#4F46E5] transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label={ariaLabel}
            className={`w-full pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
              commandStyle
                ? 'bg-transparent rounded-xl'
                : 'bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 shadow-xs'
            }`}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {showButton && (
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] rounded-xl transition-all shadow-sm shadow-indigo-600/20 whitespace-nowrap shrink-0"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </form>
  );
}
