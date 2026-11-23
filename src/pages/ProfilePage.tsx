import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const INTEREST_OPTIONS = [
  'Technology & Coding',
  'Data, Math & AI',
  'Healthcare & Medicine',
  'Finance & Accounting',
  'Law, Policy & Governance',
  'Design & Creative Media',
  'Business & Leadership',
  'Education & Research',
  'Aviation & Mobility',
  'Hospitality & Culinary',
];

const QUALIFICATION_OPTIONS = [
  'Class 10 Student',
  'Class 12 (Science PCM)',
  'Class 12 (Science PCB)',
  'Class 12 (Commerce)',
  'Class 12 (Arts / Humanities)',
  'Undergraduate Student',
  'Graduate / Working Professional',
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { language, t } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [qualification, setQualification] = useState(user?.qualification || QUALIFICATION_OPTIONS[1]);
  const [currentClassOrDegree, setCurrentClassOrDegree] = useState(user?.currentClassOrDegree || '');
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [bio, setBio] = useState(user?.bio || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const toggleInterest = (area: string) => {
    setSaved(false);
    setInterests((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    updateProfile({
      name: name.trim(),
      age: age.trim(),
      qualification,
      currentClassOrDegree: currentClassOrDegree.trim(),
      interests,
      preferredLanguage: language,
      bio: bio.trim(),
    });
    setSaved(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#4F46E5] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('profile.backToDashboard')}</span>
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="bg-white/95 border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]" />

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#7C3AED]">{t('profile.kicker')}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('profile.title')}</h1>
            <p className="text-sm text-slate-600">{t('profile.subtitle')}</p>
          </div>

          {saved && (
            <div
              role="status"
              className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('profile.savedNotice')}</span>
            </div>
          )}

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="prof-name" className="block text-xs font-semibold text-slate-700">
                  {t('profile.fullName')}
                </label>
                <input
                  id="prof-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSaved(false);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#4F46E5] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prof-email" className="block text-xs font-semibold text-slate-700">
                  {t('profile.email')}
                </label>
                <input
                  id="prof-email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="prof-age" className="block text-xs font-semibold text-slate-700">
                  {t('profile.age')}
                </label>
                <input
                  id="prof-age"
                  type="number"
                  min={13}
                  max={45}
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="e.g. 17"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#4F46E5] outline-none tabular-nums"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="prof-qual" className="block text-xs font-semibold text-slate-700">
                  {t('profile.qualification')}
                </label>
                <select
                  id="prof-qual"
                  value={qualification}
                  onChange={(e) => {
                    setQualification(e.target.value);
                    setSaved(false);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#4F46E5] outline-none"
                >
                  {QUALIFICATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-class" className="block text-xs font-semibold text-slate-700">
                {t('profile.currentClass')}
              </label>
              <input
                id="prof-class"
                type="text"
                value={currentClassOrDegree}
                onChange={(e) => {
                  setCurrentClassOrDegree(e.target.value);
                  setSaved(false);
                }}
                placeholder="e.g. Class 12 CBSE · Preparing for JEE & CUET"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#4F46E5] outline-none"
              />
            </div>

            <LanguageSelector variant="profile" />

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">{t('profile.interests')}</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((area) => {
                  const active = interests.includes(area);
                  return (
                    <motion.button
                      key={area}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleInterest(area)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        active
                          ? 'bg-gradient-to-r from-[#2563EB] to-[#4F46E5] border-transparent text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                      <span>{area}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-bio" className="block text-xs font-semibold text-slate-700">
                {t('profile.bio')}
              </label>
              <textarea
                id="prof-bio"
                rows={3}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setSaved(false);
                }}
                placeholder="Share what kind of work or colleges you are aiming for..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#4F46E5] outline-none resize-y"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:opacity-95 rounded-xl transition-opacity shadow-sm"
              >
                {t('profile.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
