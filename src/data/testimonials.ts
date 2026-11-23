export interface Testimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  quote: string;
  outcome: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Ananya Deshmukh',
    role: 'B.Tech CSE Sophomore',
    institution: 'NIT Tiruchirappalli',
    quote:
      'I was torn between Architecture and Computer Science after Class 12. Comparing college placements, exam timelines, and taking the CareerPath aptitude quiz gave my parents and me complete clarity.',
    outcome: 'Cleared JEE Main (99.1 percentile) and secured Reliance UG Scholarship',
  },
  {
    id: 't2',
    name: 'Rohan Kulkarni',
    role: 'BA LL.B. (Hons) Student',
    institution: 'NLSIU Bengaluru',
    quote:
      'The entrance exam roadmap and AI Counselor helped me structure my CLAT reading comprehension strategy alongside Class 12 boards without burning out.',
    outcome: 'Ranked AIR 84 in CLAT and shortlisted 3 top National Law Universities',
  },
  {
    id: 't3',
    name: 'Meera Krishnan',
    role: 'CA Finalist & Audit Intern',
    institution: 'SRCC Alumni · Bengaluru',
    quote:
      'Seeing the exact post-12th trajectory for Chartered Accountancy alongside B.Com (Hons) made planning my articleship and college applications effortless.',
    outcome: 'Cleared CA Intermediate both groups in first attempt',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'f1',
    category: 'Getting Started',
    question: 'How does CareerPath recommend careers after Class 10 or 12?',
    answer:
      'Our 12-question Career Assessment Quiz evaluates your subject curiosity, problem-solving style, work environment preferences, and risk comfort to rank your top 3 career matches with direct links to eligible courses and entrance exams.',
  },
  {
    id: 'f2',
    category: 'Exams & Colleges',
    question: 'Are the entrance exam dates and NIRF rankings updated for the 2026–2027 cycle?',
    answer:
      'Yes. All entrance exam timelines, eligibility rules, and college fee/placement benchmarks reflect the 2026–2027 Indian academic cycle across NTA, IITs, AIIMS, IIMs, and NLUs. Always verify final dates on the linked official portals.',
  },
  {
    id: 'f3',
    category: 'Scholarships',
    question: 'Can I apply for multiple scholarships at the same time?',
    answer:
      'Many private and CSR scholarships (such as Reliance Foundation or HDFC Parivartan) allow applicants alongside state tuition waivers, whereas government schemes on the National Scholarship Portal (NSP) generally restrict holding two central scholarships simultaneously. Check each scheme’s eligibility rules.',
  },
  {
    id: 'f4',
    category: 'AI Counselor',
    question: 'How does the AI Career Counselor personalize its advice?',
    answer:
      'When you sign in and complete your Student Profile (qualification, current class or degree, and academic interests), the CareerPath AI Counselor automatically receives that context so its suggestions match your stream and goals.',
  },
  {
    id: 'f5',
    category: 'Account & Privacy',
    question: 'Where are my bookmarks, profile, and quiz results saved?',
    answer:
      'Your student account, academic profile, saved careers/courses/colleges, and quiz history are persisted locally in your browser storage so you can revisit your Dashboard anytime on this device without friction.',
  },
  {
    id: 'f6',
    category: 'College Comparison',
    question: 'How does the Compare Colleges tool work?',
    answer:
      'On the Colleges directory, click "Compare" on up to 3 institutions. A side-by-side comparison tray opens so you can inspect NIRF rank, annual fees, median placement packages, accepted exams, and campus type together.',
  },
];
