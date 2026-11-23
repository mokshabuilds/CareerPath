export type LanguageCode = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'es' | 'fr' | 'de';

export type StreamType = 'Science' | 'Commerce' | 'Arts' | 'Vocational';

export type SalaryBracket = 'Entry-Mid (4–10 LPA)' | 'High (10–20 LPA)' | 'Very High (20+ LPA)';

export interface Career {
  id: string;
  title: string;
  stream: StreamType;
  interestArea: string;
  shortDesc: string;
  overview: string;
  averageSalary: string;
  salaryBracket: SalaryBracket;
  salaryMinLpa: number;
  growthOutlook: string;
  requiredSkills: string[];
  eligibility: string;
  pathAfter10th: string;
  pathAfter12th: string;
  topRecruiters: string[];
  futureScope: string;
  recommendedCourseIds: string[];
  recommendedExamIds: string[];
}

export type CourseLevel = 'Diploma' | 'UG' | 'PG';

export interface Course {
  id: string;
  title: string;
  shortName: string;
  level: CourseLevel;
  stream: StreamType;
  duration: string;
  durationYears: number;
  feesRange: string;
  eligibility: string;
  overview: string;
  highlights: string[];
  careerOptionIds: string[];
  entranceExamIds: string[];
}

export type CollegeType = 'Government' | 'Private';

export interface College {
  id: string;
  name: string;
  shortName: string;
  monogram: string;
  city: string;
  state: string;
  type: CollegeType;
  nirfRank: number;
  nirfRankDisplay?: string;
  nirfCategory: string;
  streams: StreamType[];
  rating: number;
  feesRange: string;
  established: number;
  image?: string;
  overview: string;
  coursesOffered: string[];
  acceptedExams: string[];
  placementMedian: string;
  campusHighlights: string[];
  website: string;
}

export interface EntranceExam {
  id: string;
  name: string;
  fullName: string;
  stream: StreamType | 'All Streams';
  conductingBody: string;
  examDate: string;
  isoDate: string;
  applicationDeadline: string;
  mode: string;
  eligibility: string;
  pattern: string;
  syllabusSummary: string[];
  preparationTips: string[];
  officialWebsite: string;
  relatedCareerIds: string[];
}

export type ScholarshipCategory = 'Merit' | 'Need-Based' | 'Minority / Reserved' | 'Women in STEM' | 'All';

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  category: ScholarshipCategory;
  level: 'School (11–12)' | 'UG' | 'PG' | 'UG & PG';
  genderEligibility: 'All' | 'Female';
  incomeLimit: string;
  amount: string;
  deadline: string;
  isoDeadline: string;
  closingSoon: boolean;
  eligibility: string;
  documentsRequired: string[];
  applyUrl: string;
}

export interface QuizOption {
  id: string;
  label: string;
  weights: Record<string, number>;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  dimension: string;
  options: QuizOption[];
}

export interface QuizResultRecord {
  id: string;
  date: string;
  topCareerIds: string[];
  dominantTraits: string[];
  scores: Record<string, number>;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  age?: string;
  qualification: string;
  currentClassOrDegree: string;
  interests: string[];
  preferredLanguage?: LanguageCode;
  bio?: string;
  createdAt: string;
}

export interface BookmarksState {
  careers: string[];
  courses: string[];
  colleges: string[];
  scholarships: string[];
}
