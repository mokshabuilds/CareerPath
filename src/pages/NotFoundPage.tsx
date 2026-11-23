import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="bg-white/95 border border-slate-200/90 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-sm"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white inline-flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold text-[#7C3AED] tabular-nums">404</p>
          <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
          <p className="text-sm text-slate-600">
            The page you are looking for might have moved or does not exist. Let&apos;s get you back
            on track.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 rounded-xl transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/careers"
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Explore Careers
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
