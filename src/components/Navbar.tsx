import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { TranslationDict } from '../i18n/translations';

const PRIMARY_LINKS: { to: string; key: keyof TranslationDict }[] = [
  { to: '/careers', key: 'nav.careers' },
  { to: '/courses', key: 'nav.courses' },
  { to: '/colleges', key: 'nav.colleges' },
  { to: '/exams', key: 'nav.exams' },
  { to: '/scholarships', key: 'nav.scholarships' },
];

const MOBILE_EXTRA_LINKS: { to: string; key: keyof TranslationDict }[] = [
  { to: '/quiz', key: 'nav.quiz' },
  { to: '/about', key: 'nav.about' },
  { to: '/faq', key: 'nav.faq' },
  { to: '/contact', key: 'nav.contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_1px_12px_-4px_rgba(15,23,42,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <Link
          to="/"
          onClick={closeMobile}
          className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display group"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white inline-flex items-center justify-center shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4" aria-hidden="true" />
          </span>
          <span>CareerPath</span>
        </Link>

        {/* Zone 2: 5 concise single-line text links with layoutId active indicator */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 lg:gap-7">
          {PRIMARY_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive ? 'text-[#2563EB] font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{t(item.key)}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute left-0 right-0 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Language selector + 1 primary action + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <LanguageSelector variant="navbar" />

          <Link
            to={user ? '/dashboard' : '/login'}
            state={{ from: location.pathname }}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] rounded-xl shadow-sm shadow-blue-600/20 transition-all whitespace-nowrap shrink-0"
          >
            {user ? t('nav.dashboard') : t('nav.signIn')}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-slate-700 hover:bg-slate-100/80 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            aria-label="Mobile navigation"
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-4 space-y-2"
          >
            <LanguageSelector variant="mobile" />
            <div className="space-y-1">
              {[...PRIMARY_LINKS, ...MOBILE_EXTRA_LINKS].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-[#4F46E5] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to={user ? '/dashboard' : '/login'}
                onClick={closeMobile}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] rounded-xl transition-colors"
              >
                {user ? `${t('nav.dashboard')} (${user.name.split(' ')[0]})` : t('nav.signInRegister')}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
