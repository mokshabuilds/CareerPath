import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const { login, register, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; notice?: string } | null;

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const destination = state?.from && state.from !== '/login' ? state.from : '/dashboard';

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'login') {
      const res = login({ email, password });
      if (!res.ok) {
        setError(res.error || 'Sign in failed.');
        return;
      }
      navigate(destination, { replace: true });
      return;
    }

    if (mode === 'register') {
      const res = register({ name, email, password });
      if (!res.ok) {
        setError(res.error || 'Registration failed.');
        return;
      }
      navigate(destination, { replace: true });
      return;
    }

    const resetRes = requestPasswordReset(email);
    if (!resetRes.ok) {
      setError(resetRes.message);
      return;
    }
    setSuccessMsg(resetRes.message);
  };

  return (
    <div className="relative max-w-md mx-auto px-4 py-14 sm:py-20">
      <div
        aria-hidden="true"
        className="absolute -top-6 -left-10 w-56 h-56 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-6 -right-10 w-56 h-56 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(79,70,229,0.18)]"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]" />

        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white inline-flex items-center justify-center mx-auto shadow-md">
              <Compass className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === 'login' && 'Sign in to CareerPath'}
              {mode === 'register' && 'Create Student Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h1>
            <p className="text-sm text-slate-600">
              {mode === 'login' && 'Access your saved careers, colleges, and quiz roadmap.'}
              {mode === 'register' && 'Save your career bookmarks, quiz results, and profile.'}
              {mode === 'forgot' && 'Enter your registered email to recover access.'}
            </p>
          </div>

          {state?.notice && !error && !successMsg && (
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-xl px-4 py-3 text-xs font-medium">
              {state.notice}
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/90 border border-slate-200/70 rounded-xl">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`relative py-2 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'login' ? 'text-[#4F46E5]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'login' && (
                  <motion.span
                    layoutId="auth-mode-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/70"
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`relative py-2 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'register' ? 'text-[#4F46E5]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'register' && (
                  <motion.span
                    layoutId="auth-mode-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/70"
                  />
                )}
                <span className="relative z-10">Register</span>
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              role="status"
              className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3.5 text-xs flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#4F46E5] outline-none transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#4F46E5] outline-none transition-colors"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs font-semibold text-[#7C3AED] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#4F46E5] outline-none transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:opacity-95 rounded-xl transition-opacity shadow-sm"
            >
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Instructions'}
            </button>
          </form>

          {mode === 'forgot' && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-xs font-semibold text-[#4F46E5] hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
