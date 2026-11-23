import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    dimension: 'Problem Solving Style',
    prompt: 'When you face an unfamiliar challenge in school or daily life, what approach feels most natural?',
    options: [
      { id: '1a', label: 'Break it down logically, test patterns, or build a tool/code to solve it', weights: { 'software-engineer': 3, 'data-scientist': 3, 'cybersecurity-analyst': 2, 'robotics-engineer': 2 } },
      { id: '1b', label: 'Understand how it impacts people and help someone through it directly', weights: { 'doctor-mbbs': 3, 'psychologist': 3, 'educator-professor': 2 } },
      { id: '1c', label: 'Analyze the numbers, financial trade-offs, and practical return', weights: { 'chartered-accountant': 3, 'investment-banker': 3, 'financial-analyst': 2 } },
      { id: '1d', label: 'Sketch out a fresh creative concept or persuasive argument', weights: { 'ux-product-designer': 3, 'architect': 2, 'corporate-lawyer': 2, 'journalist-media': 2 } },
    ],
  },
  {
    id: 2,
    dimension: 'Favorite Subject Cluster',
    prompt: 'Which set of subjects keeps you genuinely curious even outside exam prep?',
    options: [
      { id: '2a', label: 'Mathematics, Physics, Computer Science & Logical Puzzles', weights: { 'software-engineer': 3, 'data-scientist': 3, 'commercial-pilot': 2, 'robotics-engineer': 3 } },
      { id: '2b', label: 'Biology, Chemistry, Human Anatomy & Health Sciences', weights: { 'doctor-mbbs': 3, 'biotech-researcher': 3, 'pharmacist-clinical': 3 } },
      { id: '2c', label: 'Accountancy, Economics, Markets & Business Case Studies', weights: { 'chartered-accountant': 3, 'investment-banker': 3, 'entrepreneur-founder': 2, 'financial-analyst': 3 } },
      { id: '2d', label: 'Political Science, History, Literature, Psychology or Visual Arts', weights: { 'civil-services': 3, 'corporate-lawyer': 3, 'psychologist': 2, 'journalist-media': 2, 'ux-product-designer': 2 } },
    ],
  },
  {
    id: 3,
    dimension: 'Ideal Work Environment',
    prompt: 'Where can you picture yourself doing your best work five years from now?',
    options: [
      { id: '3a', label: 'A fast-paced tech product team or R&D engineering lab', weights: { 'software-engineer': 3, 'data-scientist': 2, 'ux-product-designer': 2, 'cybersecurity-analyst': 2 } },
      { id: '3b', label: 'A hospital ward, research clinic, or life-sciences laboratory', weights: { 'doctor-mbbs': 3, 'biotech-researcher': 3, 'pharmacist-clinical': 2, 'psychologist': 2 } },
      { id: '3c', label: 'Boardrooms, financial trading desks, or launching my own company', weights: { 'investment-banker': 3, 'entrepreneur-founder': 3, 'chartered-accountant': 2, 'digital-marketing-strategist': 2 } },
      { id: '3d', label: 'Courtrooms, district governance offices, design studios, or dynamic field roles', weights: { 'corporate-lawyer': 3, 'civil-services': 3, 'architect': 2, 'commercial-pilot': 2, 'culinary-chef': 2 } },
    ],
  },
  {
    id: 4,
    dimension: 'Impact Motivation',
    prompt: 'What kind of achievement would make you proudest at the end of a major project?',
    options: [
      { id: '4a', label: 'Shipping a digital product or AI system used by millions of people', weights: { 'software-engineer': 3, 'ux-product-designer': 3, 'game-developer': 2, 'data-scientist': 2 } },
      { id: '4b', label: 'Healing patients, advancing medicine, or supporting mental wellbeing', weights: { 'doctor-mbbs': 3, 'psychologist': 3, 'biotech-researcher': 2, 'pharmacist-clinical': 2 } },
      { id: '4c', label: 'Serving society through public policy, justice, or educating youth', weights: { 'civil-services': 3, 'corporate-lawyer': 2, 'educator-professor': 3, 'journalist-media': 2 } },
      { id: '4d', label: 'Closing high-stakes deals, scaling a brand, or crafting memorable experiences', weights: { 'entrepreneur-founder': 3, 'investment-banker': 2, 'digital-marketing-strategist': 3, 'culinary-chef': 2 } },
    ],
  },
  {
    id: 5,
    dimension: 'Hands-On Preference',
    prompt: 'If you had a free weekend to build or create something, what would you pick?',
    options: [
      { id: '5a', label: 'Build a web app, automate a task with Python, or tinker with hardware', weights: { 'software-engineer': 3, 'robotics-engineer': 3, 'cybersecurity-analyst': 2, 'game-developer': 2 } },
      { id: '5b', label: 'Redesign an app interface, sketch buildings, or edit a short film', weights: { 'ux-product-designer': 3, 'architect': 3, 'game-developer': 2, 'journalist-media': 2 } },
      { id: '5c', label: 'Plan a mini business budget, track stocks, or organize a campus event', weights: { 'entrepreneur-founder': 3, 'financial-analyst': 3, 'chartered-accountant': 2, 'digital-marketing-strategist': 2 } },
      { id: '5d', label: 'Experiment with a new recipe, tutor a junior student, or volunteer at a camp', weights: { 'culinary-chef': 3, 'educator-professor': 3, 'psychologist': 2, 'doctor-mbbs': 1 } },
    ],
  },
  {
    id: 6,
    dimension: 'Risk & Structure',
    prompt: 'How do you feel about structured career ladders versus entrepreneurial uncertainty?',
    options: [
      { id: '6a', label: 'I like clear professional credentials (CA, MBBS, UPSC, Law) with high trust', weights: { 'chartered-accountant': 3, 'doctor-mbbs': 3, 'civil-services': 3, 'corporate-lawyer': 2 } },
      { id: '6b', label: 'I enjoy high-growth tech/finance roles where skill and speed accelerate pay', weights: { 'software-engineer': 3, 'data-scientist': 3, 'investment-banker': 3, 'cybersecurity-analyst': 2 } },
      { id: '6c', label: 'I thrive in creative autonomy, experimentation, and building from scratch', weights: { 'entrepreneur-founder': 3, 'ux-product-designer': 2, 'culinary-chef': 2, 'game-developer': 2 } },
      { id: '6d', label: 'I prefer mission-driven work in classrooms, labs, or media newsrooms', weights: { 'educator-professor': 3, 'biotech-researcher': 2, 'journalist-media': 3, 'psychologist': 2 } },
    ],
  },
  {
    id: 7,
    dimension: 'Communication & Persuasion',
    prompt: 'Which communication skill comes easiest to you?',
    options: [
      { id: '7a', label: 'Debating viewpoints, structuring arguments, and writing persuasive briefs', weights: { 'corporate-lawyer': 3, 'civil-services': 3, 'journalist-media': 3 } },
      { id: '7b', label: 'Explaining complex ideas simply to friends or younger students', weights: { 'educator-professor': 3, 'psychologist': 2, 'ux-product-designer': 2 } },
      { id: '7c', label: 'Pitching ideas, negotiating deals, and motivating a team', weights: { 'entrepreneur-founder': 3, 'investment-banker': 2, 'digital-marketing-strategist': 3 } },
      { id: '7d', label: 'Communicating clearly through data charts, technical docs, or visual prototypes', weights: { 'data-scientist': 3, 'software-engineer': 2, 'architect': 3, 'chartered-accountant': 1 } },
    ],
  },
  {
    id: 8,
    dimension: 'Pressure & Precision',
    prompt: 'How do you perform when stakes are high and accuracy is non-negotiable?',
    options: [
      { id: '8a', label: 'I stay calm in emergencies and follow safety checklists meticulously', weights: { 'commercial-pilot': 3, 'doctor-mbbs': 3, 'cybersecurity-analyst': 2 } },
      { id: '8b', label: 'I double-check every balance sheet, legal clause, or regulatory standard', weights: { 'chartered-accountant': 3, 'corporate-lawyer': 2, 'pharmacist-clinical': 2 } },
      { id: '8c', label: 'I debug systematically under tight product launch deadlines', weights: { 'software-engineer': 2, 'data-scientist': 2, 'culinary-chef': 2 } },
      { id: '8d', label: 'I rally stakeholders and make decisive strategic calls quickly', weights: { 'investment-banker': 2, 'entrepreneur-founder': 3, 'civil-services': 2 } },
    ],
  },
  {
    id: 9,
    dimension: 'Analytical vs Creative Balance',
    prompt: 'Where do you fall on the analytical vs. creative spectrum?',
    options: [
      { id: '9a', label: 'Strongly quantitative & logical—love math, statistics, and systems', weights: { 'data-scientist': 3, 'financial-analyst': 3, 'software-engineer': 2, 'chartered-accountant': 2 } },
      { id: '9b', label: 'Balanced blend of engineering logic and visual/spatial craft', weights: { 'architect': 3, 'ux-product-designer': 3, 'game-developer': 3, 'robotics-engineer': 2 } },
      { id: '9c', label: 'People-centered & empathetic—curious about behavior and society', weights: { 'psychologist': 3, 'educator-professor': 2, 'civil-services': 2, 'doctor-mbbs': 2 } },
      { id: '9d', label: 'Story-driven, expressive, and culturally attuned', weights: { 'journalist-media': 3, 'digital-marketing-strategist': 3, 'culinary-chef': 2 } },
    ],
  },
  {
    id: 10,
    dimension: 'Study & Degree Horizon',
    prompt: 'How comfortable are you with long-duration specialized training before earning?',
    options: [
      { id: '10a', label: 'Very comfortable—5+ years of rigorous study (MBBS, Law, CA, UPSC) excites me', weights: { 'doctor-mbbs': 3, 'chartered-accountant': 3, 'corporate-lawyer': 2, 'civil-services': 2, 'architect': 2 } },
      { id: '10b', label: 'Prefer a 3–4 year degree with fast entry into industry & high starting pay', weights: { 'software-engineer': 3, 'data-scientist': 3, 'ux-product-designer': 2, 'financial-analyst': 2 } },
      { id: '10c', label: 'Open to intensive 1–2 year practical training or launching right away', weights: { 'commercial-pilot': 3, 'culinary-chef': 3, 'entrepreneur-founder': 2, 'digital-marketing-strategist': 2 } },
      { id: '10d', label: 'Interested in postgraduate research (M.Tech / M.Sc / PhD / MBA)', weights: { 'biotech-researcher': 3, 'investment-banker': 2, 'educator-professor': 2, 'pharmacist-clinical': 2 } },
    ],
  },
  {
    id: 11,
    dimension: 'Technology & AI Relationship',
    prompt: 'How do you want technology to feature in your future career?',
    options: [
      { id: '11a', label: 'I want to build core software, AI models, or secure digital networks', weights: { 'software-engineer': 3, 'data-scientist': 3, 'cybersecurity-analyst': 3, 'robotics-engineer': 2 } },
      { id: '11b', label: 'I want to design human-friendly digital products and interactive worlds', weights: { 'ux-product-designer': 3, 'game-developer': 3, 'digital-marketing-strategist': 2 } },
      { id: '11c', label: 'I prefer using scientific instruments, flight cockpits, or medical tech', weights: { 'commercial-pilot': 3, 'doctor-mbbs': 2, 'biotech-researcher': 3, 'pharmacist-clinical': 2 } },
      { id: '11d', label: 'Technology is just a tool—my core focus is people, law, finance, or policy', weights: { 'corporate-lawyer': 2, 'civil-services': 2, 'chartered-accountant': 2, 'psychologist': 2, 'culinary-chef': 2 } },
    ],
  },
  {
    id: 12,
    dimension: 'Global vs Local Orientation',
    prompt: 'What scale of work excites you most over the next decade?',
    options: [
      { id: '12a', label: 'Working with global tech teams or international aviation & finance hubs', weights: { 'software-engineer': 2, 'commercial-pilot': 3, 'investment-banker': 3, 'data-scientist': 2 } },
      { id: '12b', label: 'Transforming India’s governance, legal institutions, or public education', weights: { 'civil-services': 3, 'corporate-lawyer': 2, 'educator-professor': 3, 'journalist-media': 2 } },
      { id: '12c', label: 'Building Indian consumer brands, sustainable cities, or hospitality ventures', weights: { 'entrepreneur-founder': 3, 'architect': 2, 'culinary-chef': 3, 'digital-marketing-strategist': 2 } },
      { id: '12d', label: 'Advancing clinical healthcare and life sciences across communities', weights: { 'doctor-mbbs': 3, 'pharmacist-clinical': 3, 'biotech-researcher': 2, 'psychologist': 2 } },
    ],
  },
];
