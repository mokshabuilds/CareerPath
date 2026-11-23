import { Bookmark } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BookmarksState } from '../types';

interface BookmarkButtonProps {
  type: keyof BookmarksState;
  itemId: string;
  itemLabel?: string;
  compact?: boolean;
}

export default function BookmarkButton({
  type,
  itemId,
  itemLabel = 'item',
  compact = false,
}: BookmarkButtonProps) {
  const { user, isBookmarked, toggleBookmark } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const saved = user ? isBookmarked(type, itemId) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          notice: `Sign in to save ${itemLabel} to your student dashboard.`,
        },
      });
      return;
    }
    toggleBookmark(type, itemId);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? `Remove ${itemLabel} from saved` : `Save ${itemLabel}`}
        aria-pressed={saved}
        className={`w-10 h-10 rounded-xl inline-flex items-center justify-center border transition-colors shrink-0 ${
          saved
            ? 'bg-purple-50 border-purple-200 text-[#7C3AED]'
            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 ${
        saved
          ? 'bg-purple-50 border-purple-200 text-[#7C3AED]'
          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
      <span>{saved ? t('common.saved') : t('common.save')}</span>
    </button>
  );
}
