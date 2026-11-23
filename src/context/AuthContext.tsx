import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookmarksState, QuizResultRecord, StudentProfile } from '../types';

interface StoredAccount {
  profile: StudentProfile;
  passwordHash: string;
  bookmarks: BookmarksState;
  quizResults: QuizResultRecord[];
}

interface AuthContextValue {
  user: StudentProfile | null;
  isLoading: boolean;
  bookmarks: BookmarksState;
  quizResults: QuizResultRecord[];
  compareCollegeIds: string[];
  register: (input: { name: string; email: string; password: string }) => { ok: boolean; error?: string };
  login: (input: { email: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
  requestPasswordReset: (email: string) => { ok: boolean; message: string };
  updateProfile: (updates: Partial<Omit<StudentProfile, 'id' | 'email' | 'createdAt'>>) => void;
  toggleBookmark: (type: keyof BookmarksState, itemId: string) => boolean;
  isBookmarked: (type: keyof BookmarksState, itemId: string) => boolean;
  saveQuizResult: (result: Omit<QuizResultRecord, 'id' | 'date'>) => void;
  toggleCompareCollege: (collegeId: string) => { added: boolean; limitReached: boolean };
  clearCompareColleges: () => void;
}

const ACCOUNTS_KEY = 'careerpath_accounts_v1';
const SESSION_KEY = 'careerpath_session_email_v1';
const COMPARE_KEY = 'careerpath_compare_colleges_v1';

const DEFAULT_BOOKMARKS: BookmarksState = {
  careers: [],
  courses: [],
  colleges: [],
  scholarships: [],
};

function simpleHash(raw: string): string {
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}_${raw.length}`;
}

function readAccounts(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, StoredAccount>;
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, StoredAccount>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarksState>(DEFAULT_BOOKMARKS);
  const [quizResults, setQuizResults] = useState<QuizResultRecord[]>([]);
  const [compareCollegeIds, setCompareCollegeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARE_KEY);
      return saved ? (JSON.parse(saved) as string[]).slice(0, 3) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const activeEmail = localStorage.getItem(SESSION_KEY);
      if (activeEmail) {
        const accounts = readAccounts();
        const acct = accounts[activeEmail.toLowerCase()];
        if (acct) {
          setUser(acct.profile);
          setBookmarks(acct.bookmarks || DEFAULT_BOOKMARKS);
          setQuizResults(acct.quizResults || []);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareCollegeIds));
  }, [compareCollegeIds]);

  const persistCurrentAccount = (
    nextProfile: StudentProfile,
    nextBookmarks: BookmarksState,
    nextQuizResults: QuizResultRecord[]
  ) => {
    const accounts = readAccounts();
    const key = nextProfile.email.toLowerCase();
    const existing = accounts[key];
    if (!existing) return;
    accounts[key] = {
      ...existing,
      profile: nextProfile,
      bookmarks: nextBookmarks,
      quizResults: nextQuizResults,
    };
    writeAccounts(accounts);
  };

  const register: AuthContextValue['register'] = ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      return { ok: false, error: 'Please enter your full name (at least 2 characters).' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters long.' };
    }

    const accounts = readAccounts();
    if (accounts[cleanEmail]) {
      return { ok: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const profile: StudentProfile = {
      id: `stu_${Date.now().toString(36)}`,
      name: cleanName,
      email: cleanEmail,
      age: '',
      qualification: 'Class 12 (Science / Commerce / Arts)',
      currentClassOrDegree: 'Class 12',
      interests: ['Technology & Coding', 'Data, Math & AI'],
      bio: '',
      createdAt: new Date().toISOString(),
    };

    const newAcct: StoredAccount = {
      profile,
      passwordHash: simpleHash(password),
      bookmarks: DEFAULT_BOOKMARKS,
      quizResults: [],
    };
    accounts[cleanEmail] = newAcct;
    writeAccounts(accounts);
    localStorage.setItem(SESSION_KEY, cleanEmail);

    setUser(profile);
    setBookmarks(DEFAULT_BOOKMARKS);
    setQuizResults([]);
    return { ok: true };
  };

  const login: AuthContextValue['login'] = ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { ok: false, error: 'Please enter both email and password.' };
    }

    const accounts = readAccounts();
    const acct = accounts[cleanEmail];
    if (!acct) {
      return { ok: false, error: 'No account found with that email. Please create an account first.' };
    }
    if (acct.passwordHash !== simpleHash(password)) {
      return { ok: false, error: 'Incorrect password. Try again or use Forgot Password.' };
    }

    localStorage.setItem(SESSION_KEY, cleanEmail);
    setUser(acct.profile);
    setBookmarks(acct.bookmarks || DEFAULT_BOOKMARKS);
    setQuizResults(acct.quizResults || []);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setBookmarks(DEFAULT_BOOKMARKS);
    setQuizResults([]);
  };

  const requestPasswordReset: AuthContextValue['requestPasswordReset'] = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { ok: false, message: 'Please enter a valid registered email address.' };
    }
    const accounts = readAccounts();
    if (!accounts[cleanEmail]) {
      return {
        ok: false,
        message: 'We could not find a CareerPath account matching that email address.',
      };
    }
    return {
      ok: true,
      message: `Password recovery instructions have been prepared for ${cleanEmail}. Check your inbox or reset your local session credentials.`,
    };
  };

  const updateProfile: AuthContextValue['updateProfile'] = (updates) => {
    if (!user) return;
    const nextProfile: StudentProfile = { ...user, ...updates };
    setUser(nextProfile);
    persistCurrentAccount(nextProfile, bookmarks, quizResults);
  };

  const toggleBookmark: AuthContextValue['toggleBookmark'] = (type, itemId) => {
    if (!user) return false;
    const list = bookmarks[type] || [];
    const exists = list.includes(itemId);
    const nextList = exists ? list.filter((id) => id !== itemId) : [...list, itemId];
    const nextBookmarks: BookmarksState = { ...bookmarks, [type]: nextList };
    setBookmarks(nextBookmarks);
    persistCurrentAccount(user, nextBookmarks, quizResults);
    return !exists;
  };

  const isBookmarked: AuthContextValue['isBookmarked'] = (type, itemId) => {
    return (bookmarks[type] || []).includes(itemId);
  };

  const saveQuizResult: AuthContextValue['saveQuizResult'] = (result) => {
    if (!user) return;
    const record: QuizResultRecord = {
      ...result,
      id: `quiz_${Date.now().toString(36)}`,
      date: new Date().toISOString(),
    };
    const nextResults = [record, ...quizResults].slice(0, 10);
    setQuizResults(nextResults);
    persistCurrentAccount(user, bookmarks, nextResults);
  };

  const toggleCompareCollege: AuthContextValue['toggleCompareCollege'] = (collegeId) => {
    if (compareCollegeIds.includes(collegeId)) {
      setCompareCollegeIds((prev) => prev.filter((id) => id !== collegeId));
      return { added: false, limitReached: false };
    }
    if (compareCollegeIds.length >= 3) {
      return { added: false, limitReached: true };
    }
    setCompareCollegeIds((prev) => [...prev, collegeId]);
    return { added: true, limitReached: false };
  };

  const clearCompareColleges = () => setCompareCollegeIds([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        bookmarks,
        quizResults,
        compareCollegeIds,
        register,
        login,
        logout,
        requestPasswordReset,
        updateProfile,
        toggleBookmark,
        isBookmarked,
        saveQuizResult,
        toggleCompareCollege,
        clearCompareColleges,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
