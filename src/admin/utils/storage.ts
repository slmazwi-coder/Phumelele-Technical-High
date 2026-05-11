// Storage utility — localStorage wrapper

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  grade: string;
  subject: string;
  fileData: string;
  fileName: string;
  uploadDate: string;
}

export type UploadedFile = {
  key: string;
  label: string;
  fileName: string;
  mimeType: string;
  dataUrl: string;
};

export type SubjectMark = {
  subject: string;
  mark: number;
};

export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender?: string;
  grade: string;
  year: string;
  studentNumber: string;
  guardianName: string;
  guardianRelationship?: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  locality: string;
  previousSchool: string;
  lastGradeCompleted?: string;
  medicalInfo?: string;
  stream?: string; // Civil / Electrical / Mechanical / EGD / Woodworking / Construction
  uploads: UploadedFile[];
  subjectMarks: SubjectMark[];
  averageMark: number;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submittedDate: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  phone2: string;
  email: string;
  monThu: string;
  friday: string;
  weekend: string;
}

export interface AboutInfo {
  historyParagraphs: string[];
  principalName: string;
  principalTitle: string;
  principalMessage: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  title: string;
  year: string;
  desc: string;
  image: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getItems<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

function getObject<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

function setObject<T>(key: string, obj: T): void {
  localStorage.setItem(key, JSON.stringify(obj));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function padNumber(num: number, length: number) {
  return num.toString().padStart(length, '0');
}

export function generateStudentNumber(year: string): string {
  const key = `pths_student_counter_${year}`;
  const current = Number(localStorage.getItem(key) || '0');
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return `${year}-${padNumber(next, 6)}`;
}

export function calculateAverageMark(subjectMarks: SubjectMark[]): number {
  if (!subjectMarks || subjectMarks.length === 0) return 0;
  const total = subjectMarks.reduce((sum, s) => sum + (Number.isFinite(s.mark) ? s.mark : 0), 0);
  return Math.round((total / subjectMarks.length) * 10) / 10;
}

// ── News ──────────────────────────────────────────────────────────────────────

const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: '2026 Applications Now Open',
    date: '2025',
    content: 'Applications for the 2026 academic year are now open for Grades 8–12. Apply online or visit the school office.',
    image: '',
  },
  {
    id: '2',
    title: 'Technical Olympiad — District Winners',
    date: '2025',
    content: 'Our learners excelled at the district technical olympiad, placing first in both the Electrical and Civil Technology categories.',
    image: '',
  },
  {
    id: '3',
    title: 'Workshop Upgrades Completed',
    date: '2025',
    content: 'New equipment has been installed in the Mechanical Technology and Woodworking workshops, enhancing hands-on learning for all learners.',
    image: '',
  },
];

export const getNews = () => (getItems<NewsItem>('pths_news').length ? getItems<NewsItem>('pths_news') : defaultNews);
export const setNews = (items: NewsItem[]) => setItems('pths_news', items);

// ── Documents ─────────────────────────────────────────────────────────────────

export const getDocuments = () => getItems<DocumentItem>('pths_documents');
export const setDocuments = (items: DocumentItem[]) => setItems('pths_documents', items);

// ── Applications ──────────────────────────────────────────────────────────────

export const getApplications = () => getItems<Application>('pths_applications');
export const setApplications = (items: Application[]) => setItems('pths_applications', items);

// ── Contact ───────────────────────────────────────────────────────────────────

const defaultContact: ContactInfo = {
  address: 'Embizeni, Lupindo A/A, Matatiele, Eastern Cape, 4730',
  phone: '+27 72 715 0626',
  phone2: '+27 76 286 6884',
  email: 'kmohlafuno@gmail.com',
  monThu: '07:30 – 15:30',
  friday: '07:30 – 13:30',
  weekend: 'Closed',
};
export const getContact = () => getObject<ContactInfo>('pths_contact', defaultContact);
export const setContact = (info: ContactInfo) => setObject('pths_contact', info);

// ── About ─────────────────────────────────────────────────────────────────────

const defaultAbout: AboutInfo = {
  historyParagraphs: [
    'Phumelele Technical High School (also known as Phumelele Comp Tech Senior Secondary School) is a public technical school situated in the Embizeni, Lupindo A/A area of Matatiele, Eastern Cape. The school serves the local community by providing quality technical education to learners from Grade 8 through Grade 12.',
    'Our school is unique in the region for its strong focus on vocational and technical subjects. The curriculum is designed to empower learners with the necessary skills to succeed in the workplace, in further studies, and in entrepreneurship.',
    'Phumelele THS falls under the Alfred Nzo District Municipality and is a Public School registered under the Eastern Cape Department of Education (National EMIS No: 200501431). The school is committed to excellence, discipline, and producing well-rounded technical graduates.',
  ],
  principalName: 'Mr. K Mohlafuno',
  principalTitle: 'Principal',
  principalMessage: [
    'Welcome to Phumelele Technical High School. At Phumelele, we believe that technical education is the foundation of economic empowerment. Our learners do not just learn theory — they build, wire, design, and create real things.',
    'We are proud of our learners\' achievements in workshops, competitions, and examinations. Our dedicated staff work tirelessly to ensure every student reaches their potential in their chosen technical stream.',
    'We invite all families and learners to join our growing community of technical achievers. Together, we succeed — Phumelele!',
  ],
};
export const getAbout = () => getObject<AboutInfo>('pths_about', defaultAbout);
export const setAbout = (info: AboutInfo) => setObject('pths_about', info);

// ── Activities ────────────────────────────────────────────────────────────────

const defaultActivities: Activity[] = [
  { id: '1', name: 'Soccer', category: 'Sport', description: 'Boys and girls teams competing at district and regional level.', image: '' },
  { id: '2', name: 'Netball', category: 'Sport', description: 'Competitive netball teams representing the school with pride.', image: '' },
  { id: '3', name: 'Athletics', category: 'Sport', description: 'Track and field development for all learners.', image: '' },
  { id: '4', name: 'Technical Olympiad', category: 'Academic', description: 'Annual technical skills competition across all streams.', image: '' },
  { id: '5', name: 'Debate Club', category: 'Academic', description: 'Developing critical thinking and public speaking.', image: '' },
  { id: '6', name: 'Choir', category: 'Culture', description: 'School choir performing at events and competitions.', image: '' },
];
export const getActivities = () => (getItems<Activity>('pths_activities').length ? getItems<Activity>('pths_activities') : defaultActivities);
export const setActivities = (items: Activity[]) => setItems('pths_activities', items);

// ── Hall of Fame ──────────────────────────────────────────────────────────────

const defaultHall: HallOfFameEntry[] = [
  { id: '1', name: 'Top Technical Achiever', title: 'Best in Electrical Technology', year: '2025', desc: '', image: '' },
  { id: '2', name: 'Top Technical Achiever', title: 'Best in Civil Technology', year: '2025', desc: '', image: '' },
  { id: '3', name: 'Top Technical Achiever', title: 'Best in Mechanical Technology', year: '2025', desc: '', image: '' },
];
export const getHallOfFame = () => (getItems<HallOfFameEntry>('pths_hall_of_fame').length ? getItems<HallOfFameEntry>('pths_hall_of_fame') : defaultHall);
export const setHallOfFame = (items: HallOfFameEntry[]) => setItems('pths_hall_of_fame', items);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const isAuthenticated = () => localStorage.getItem('pths_admin_auth') === 'true';
export const login = (password: string): boolean => {
  if (password === 'admin2026') {
    localStorage.setItem('pths_admin_auth', 'true');
    return true;
  }
  return false;
};
export const logout = () => localStorage.removeItem('pths_admin_auth');
