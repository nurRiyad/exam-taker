export type PublicCourse = {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  level: string;
  priceLabel: string;
  nextExam: string;
  examCount: number;
};

export type PublicTeacher = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  institution: string;
  location: string;
  subject: string;
  studentCount: number;
  courseCount: number;
  popularCourseId: string;
  popularCourseTitle: string;
};

export const PUBLIC_COURSES: PublicCourse[] = [
  {
    id: "bcs-english-foundation",
    title: "BCS English Foundation",
    description: "Grammar, vocabulary, comprehension, and timed MCQ practice for early BCS preparation.",
    teacherId: "farhana-akter",
    teacherName: "Farhana Akter",
    subject: "English",
    level: "Foundation",
    priceLabel: "BDT 499",
    nextExam: "Weekly Sunday mock",
    examCount: 18,
  },
  {
    id: "math-shortcut-practice",
    title: "Math Shortcut Practice",
    description: "Fast arithmetic, algebra, and problem-solving drills for government job exams.",
    teacherId: "mahbub-hasan",
    teacherName: "Mahbub Hasan",
    subject: "Mathematics",
    level: "Intermediate",
    priceLabel: "BDT 599",
    nextExam: "Next exam in 4 days",
    examCount: 22,
  },
  {
    id: "bangladesh-affairs-mcq",
    title: "Bangladesh Affairs MCQ",
    description: "History, constitution, geography, and current affairs with exam-focused explanations.",
    teacherId: "sadia-rahman",
    teacherName: "Sadia Rahman",
    subject: "Bangladesh Affairs",
    level: "All levels",
    priceLabel: "Free",
    nextExam: "Open practice set",
    examCount: 12,
  },
  {
    id: "reasoning-masterclass",
    title: "Reasoning Masterclass",
    description: "Logical reasoning, analogy, series, and analytical practice with weak-zone review.",
    teacherId: "tanvir-ahmed",
    teacherName: "Tanvir Ahmed",
    subject: "Reasoning",
    level: "Advanced",
    priceLabel: "BDT 699",
    nextExam: "Monthly full mock",
    examCount: 16,
  },
];

export const PUBLIC_TEACHERS: PublicTeacher[] = [
  {
    id: "farhana-akter",
    name: "Farhana Akter",
    specialty: "BCS English and language skills",
    bio: "Known for concise grammar lessons, short practice exams, and clear explanations for common mistakes.",
    institution: "Dhaka Competitive Coaching",
    location: "Dhaka",
    subject: "English",
    studentCount: 1840,
    courseCount: 6,
    popularCourseId: "bcs-english-foundation",
    popularCourseTitle: "BCS English Foundation",
  },
  {
    id: "mahbub-hasan",
    name: "Mahbub Hasan",
    specialty: "Math shortcuts for timed exams",
    bio: "Focuses on practical shortcut methods, daily drills, and repeated exam-style practice.",
    institution: "Exam Focus Academy",
    location: "Chattogram",
    subject: "Mathematics",
    studentCount: 2300,
    courseCount: 8,
    popularCourseId: "math-shortcut-practice",
    popularCourseTitle: "Math Shortcut Practice",
  },
  {
    id: "sadia-rahman",
    name: "Sadia Rahman",
    specialty: "Bangladesh affairs and current events",
    bio: "Builds topic-wise MCQ sets for history, constitution, geography, and recent national updates.",
    institution: "Public Service Prep",
    location: "Rajshahi",
    subject: "Bangladesh Affairs",
    studentCount: 1260,
    courseCount: 4,
    popularCourseId: "bangladesh-affairs-mcq",
    popularCourseTitle: "Bangladesh Affairs MCQ",
  },
  {
    id: "tanvir-ahmed",
    name: "Tanvir Ahmed",
    specialty: "Reasoning and analytical ability",
    bio: "Turns reasoning topics into repeatable patterns students can practice under exam timing.",
    institution: "Independent Teacher",
    location: "Sylhet",
    subject: "Reasoning",
    studentCount: 980,
    courseCount: 5,
    popularCourseId: "reasoning-masterclass",
    popularCourseTitle: "Reasoning Masterclass",
  },
];

export const COURSE_FILTERS = ["All", ...Array.from(new Set(PUBLIC_COURSES.map((course) => course.subject)))] as const;
export const TEACHER_FILTERS = ["All", ...Array.from(new Set(PUBLIC_TEACHERS.map((teacher) => teacher.subject)))] as const;