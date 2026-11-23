import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-slate-950 text-slate-300 mt-24 overflow-hidden border-t border-slate-800/80">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/5 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-white font-display"
            >
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white inline-flex items-center justify-center">
                <Compass className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>CareerPath</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-white">{t('footer.explore')}</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/careers" className="hover:text-white transition-colors">{t('nav.careers')}</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">{t('nav.courses')}</Link></li>
              <li><Link to="/colleges" className="hover:text-white transition-colors">{t('nav.colleges')}</Link></li>
              <li><Link to="/exams" className="hover:text-white transition-colors">{t('nav.exams')}</Link></li>
              <li><Link to="/scholarships" className="hover:text-white transition-colors">{t('nav.scholarships')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-white">{t('footer.guidance')}</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/quiz" className="hover:text-white transition-colors">{t('nav.quiz')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">{t('nav.dashboard')}</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">{t('profile.title')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-white">{t('footer.information')}</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">{t('nav.faq')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerPath Guidance Portal.</p>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
