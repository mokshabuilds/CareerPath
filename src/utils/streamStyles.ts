import { StreamType } from '../types';

export interface StreamVisualTheme {
  gradientBar: string;
  softBg: string;
  textAccent: string;
  borderHover: string;
  iconBg: string;
  glowShadow: string;
}

export function getStreamTheme(stream: StreamType | 'All Streams' | string): StreamVisualTheme {
  switch (stream) {
    case 'Science':
      return {
        gradientBar: 'from-blue-600 via-indigo-600 to-cyan-500',
        softBg: 'bg-gradient-to-br from-blue-50/90 via-white to-cyan-50/70',
        textAccent: 'text-blue-700',
        borderHover: 'hover:border-blue-300',
        iconBg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
        glowShadow: 'hover:shadow-[0_12px_32px_-8px_rgba(37,99,235,0.22)]',
      };
    case 'Commerce':
      return {
        gradientBar: 'from-emerald-600 via-teal-500 to-cyan-500',
        softBg: 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70',
        textAccent: 'text-emerald-700',
        borderHover: 'hover:border-emerald-300',
        iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-500',
        glowShadow: 'hover:shadow-[0_12px_32px_-8px_rgba(5,150,105,0.22)]',
      };
    case 'Arts':
      return {
        gradientBar: 'from-violet-600 via-purple-600 to-rose-500',
        softBg: 'bg-gradient-to-br from-violet-50/90 via-white to-rose-50/60',
        textAccent: 'text-violet-700',
        borderHover: 'hover:border-violet-300',
        iconBg: 'bg-gradient-to-br from-violet-600 to-rose-500',
        glowShadow: 'hover:shadow-[0_12px_32px_-8px_rgba(124,58,237,0.22)]',
      };
    case 'Vocational':
      return {
        gradientBar: 'from-amber-500 via-orange-500 to-rose-500',
        softBg: 'bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70',
        textAccent: 'text-amber-700',
        borderHover: 'hover:border-amber-300',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        glowShadow: 'hover:shadow-[0_12px_32px_-8px_rgba(245,158,11,0.22)]',
      };
    default:
      return {
        gradientBar: 'from-indigo-600 via-violet-600 to-cyan-500',
        softBg: 'bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/70',
        textAccent: 'text-indigo-700',
        borderHover: 'hover:border-indigo-300',
        iconBg: 'bg-gradient-to-br from-indigo-600 to-violet-600',
        glowShadow: 'hover:shadow-[0_12px_32px_-8px_rgba(79,70,229,0.22)]',
      };
  }
}

export function getScholarshipCategoryTheme(category: string): StreamVisualTheme {
  switch (category) {
    case 'Women in STEM':
      return getStreamTheme('Arts');
    case 'Need-Based':
      return getStreamTheme('Commerce');
    case 'Minority / Reserved':
      return getStreamTheme('Vocational');
    case 'Merit':
    default:
      return getStreamTheme('Science');
  }
}

export function getDaysUntil(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00`);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
