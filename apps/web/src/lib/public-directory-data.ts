export type PublicCourse = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  fullSyllabus: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  level: string;
  priceLabel: string;
  discountLabel?: string;
  nextExam: string;
  examCount: number;
  studentCount: number;
  participantCount: number;
  completionLabel: string;
  outcomes: string[];
  recommendedResources: string[];
  examTopics: PublicExamTopic[];
  pastExams: PublicPastExam[];
};

export type PublicExamTopic = {
  id: string;
  title: string;
  shortDescription: string;
  scheduledAtLabel: string;
  status: "Done" | "Upcoming";
  participantCount?: number;
  topScoreLabel?: string;
  topScoreUsername?: string;
  publicNote: string;
};

export type PublicPastExam = {
  id: string;
  title: string;
  dateLabel: string;
  syllabusSummary: string;
  liveParticipantCount: number;
  topScoreLabel: string;
  topScoreUsername: string;
};

export type PublicTeacher = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  description: string;
  institution: string;
  location: string;
  subject: string;
  studentCount: number;
  courseCount: number;
  popularCourseId: string;
  popularCourseTitle: string;
  teachingStyle: string[];
};

export const PUBLIC_COURSES: PublicCourse[] = [
  {
    id: "bcs-english-foundation",
    title: "BCS English Foundation",
    description: "Grammar, vocabulary, comprehension, and timed MCQ practice for early BCS preparation.",
    fullDescription:
      "A practical English route for BCS and government-job candidates who need repeated MCQ practice with quick feedback. The course starts from grammar fundamentals and moves into timed comprehension, vocabulary, and mixed mock exams.",
    fullSyllabus: "Grammar, vocabulary, sentence correction, idioms, reading comprehension, and mixed English mocks.",
    teacherId: "farhana-akter",
    teacherName: "Farhana Akter",
    subject: "English",
    level: "Foundation",
    priceLabel: "BDT 499",
    discountLabel: "Intro discount available",
    nextExam: "Weekly Sunday mock",
    examCount: 10,
    studentCount: 1840,
    participantCount: 1215,
    completionLabel: "66% attempted at least one exam",
    outcomes: ["Build grammar accuracy", "Practice timed English MCQs", "Find weak grammar and vocabulary zones"],
    recommendedResources: [
      "English Grammar in Use",
      "Professor's English for Competitive Exams",
      "Daily vocabulary notebook",
      "Previous BCS English questions",
    ],
    examTopics: [
      {
        id: "diagnostic-english",
        title: "English Diagnostic Mock",
        shortDescription: "Mixed grammar and vocabulary baseline exam for identifying first weak zones.",
        scheduledAtLabel: "Saturday, 5 July · 8:00 PM",
        status: "Done",
        participantCount: 418,
        topScoreLabel: "43/50",
        topScoreUsername: "nabila_17",
        publicNote: "Exam already done. Details stay locked for non-enrolled students.",
      },
      {
        id: "grammar-sprint",
        title: "Grammar Sprint",
        shortDescription: "Tense, voice, narration, and sentence correction under time pressure.",
        scheduledAtLabel: "Saturday, 12 July · 8:00 PM",
        status: "Done",
        participantCount: 392,
        topScoreLabel: "46/50",
        topScoreUsername: "sabbir_bcs",
        publicNote: "Exam already done. Public summary is visible; results are locked after login/enrollment.",
      },
      {
        id: "grammar-basics",
        title: "Grammar Basics Live Mock",
        shortDescription: "Parts of speech, tense, subject-verb agreement, and common correction traps.",
        scheduledAtLabel: "Sunday, 19 July · 8:00 PM",
        status: "Upcoming",
        publicNote: "Upcoming exam. Details are visible now; answer/result access stays locked until enrollment.",
      },
      {
        id: "vocabulary-idioms",
        title: "Vocabulary And Idioms",
        shortDescription: "Synonyms, antonyms, idioms, and phrase usage from recent competitive patterns.",
        scheduledAtLabel: "Sunday, 26 July · 8:00 PM",
        status: "Upcoming",
        publicNote: "Marks and question count stay hidden until publish.",
      },
      {
        id: "sentence-correction",
        title: "Sentence Correction Drill",
        shortDescription: "Common grammar traps, modifier errors, and exam-style correction questions.",
        scheduledAtLabel: "Wednesday, 29 July · 8:00 PM",
        status: "Upcoming",
        publicNote: "Future topic is public; marks and question count stay hidden until publish.",
      },
      {
        id: "reading-comprehension",
        title: "Reading Comprehension Drill",
        shortDescription: "Short passages, inference questions, and time-management practice.",
        scheduledAtLabel: "Sunday, 2 August · 8:00 PM",
        status: "Upcoming",
        publicNote: "Future topic is public; exam details unlock after publish.",
      },
      {
        id: "preposition-articles",
        title: "Preposition And Article Mock",
        shortDescription: "High-frequency preposition, article, and phrase-usage questions.",
        scheduledAtLabel: "Sunday, 9 August · 8:00 PM",
        status: "Upcoming",
        publicNote: "Future topic is public; marks and question count stay hidden until publish.",
      },
      {
        id: "translation-context",
        title: "Translation And Context",
        shortDescription: "Bangla-to-English meaning, contextual vocabulary, and phrase selection.",
        scheduledAtLabel: "Sunday, 16 August · 8:00 PM",
        status: "Upcoming",
        publicNote: "Future topic is public; exam details unlock after publish.",
      },
      {
        id: "mixed-english-01",
        title: "Mixed English Mock 01",
        shortDescription: "Full mixed MCQ exam across grammar, vocabulary, idioms, and comprehension.",
        scheduledAtLabel: "Sunday, 23 August · 8:00 PM",
        status: "Upcoming",
        publicNote: "Future topic is public; marks and question count stay hidden until publish.",
      },
      {
        id: "final-english-mock",
        title: "Final English Route Mock",
        shortDescription: "Course-end full mock to compare weak-zone progress against the diagnostic exam.",
        scheduledAtLabel: "Sunday, 30 August · 8:00 PM",
        status: "Upcoming",
        publicNote: "Future topic is public; exam details unlock after publish.",
      },
    ],
    pastExams: [
      {
        id: "english-diagnostic-01",
        title: "English Diagnostic Mock",
        dateLabel: "5 July 2026",
        syllabusSummary: "Mixed grammar and vocabulary baseline exam.",
        liveParticipantCount: 418,
        topScoreLabel: "43/50",
        topScoreUsername: "nabila_17",
      },
      {
        id: "grammar-sprint-01",
        title: "Grammar Sprint",
        dateLabel: "12 July 2026",
        syllabusSummary: "Tense, voice, narration, and correction questions.",
        liveParticipantCount: 392,
        topScoreLabel: "46/50",
        topScoreUsername: "sabbir_bcs",
      },
    ],
  },
  {
    id: "math-shortcut-practice",
    title: "Math Shortcut Practice",
    description: "Fast arithmetic, algebra, and problem-solving drills for government job exams.",
    fullDescription:
      "A focused math practice course built around speed, pattern recognition, and repeated timed sets. Students work through arithmetic, algebra, percentage, ratio, and word-problem shortcuts.",
    fullSyllabus: "Arithmetic, percentage, ratio, algebra, number series, word problems, and full math mocks.",
    teacherId: "mahbub-hasan",
    teacherName: "Mahbub Hasan",
    subject: "Mathematics",
    level: "Intermediate",
    priceLabel: "BDT 599",
    nextExam: "Next exam in 4 days",
    examCount: 22,
    studentCount: 2300,
    participantCount: 1480,
    completionLabel: "64% attempted at least one exam",
    outcomes: ["Solve faster under time pressure", "Recognize common math patterns", "Track weak quantitative topics"],
    recommendedResources: ["Shortcut math notebook", "Previous bank-job math questions", "Daily arithmetic drills"],
    examTopics: [
      {
        id: "math-baseline",
        title: "Math Baseline Test",
        shortDescription: "Arithmetic and basic algebra diagnostic.",
        scheduledAtLabel: "Wednesday, 8 July · 9:00 PM",
        status: "Done",
        participantCount: 530,
        topScoreLabel: "47/50",
        topScoreUsername: "raihan_math",
        publicNote: "Exam already done. Details stay locked for non-enrolled students.",
      },
      {
        id: "percentage-ratio",
        title: "Percentage And Ratio Mock",
        shortDescription: "Percentage change, ratio comparison, profit-loss, and shortcut arithmetic.",
        scheduledAtLabel: "Thursday, 23 July · 9:00 PM",
        status: "Upcoming",
        publicNote: "Upcoming exam. Details are visible now; answer/result access stays locked until enrollment.",
      },
      {
        id: "algebra-word-problems",
        title: "Algebra Word Problems",
        shortDescription: "Equation setup, age problems, work-rate, and mixture questions.",
        scheduledAtLabel: "Thursday, 30 July · 9:00 PM",
        status: "Upcoming",
        publicNote: "Marks and question count stay hidden until publish.",
      },
    ],
    pastExams: [
      {
        id: "math-baseline-01",
        title: "Math Baseline Test",
        dateLabel: "8 July 2026",
        syllabusSummary: "Arithmetic and basic algebra diagnostic.",
        liveParticipantCount: 530,
        topScoreLabel: "47/50",
        topScoreUsername: "raihan_math",
      },
    ],
  },
  {
    id: "bangladesh-affairs-mcq",
    title: "Bangladesh Affairs MCQ",
    description: "History, constitution, geography, and current affairs with exam-focused explanations.",
    fullDescription:
      "A topic-wise Bangladesh Affairs course for candidates who want structured MCQ practice across history, constitution, geography, economy, and current events.",
    fullSyllabus: "Liberation War, constitution, geography, economy, culture, and recent national affairs.",
    teacherId: "sadia-rahman",
    teacherName: "Sadia Rahman",
    subject: "Bangladesh Affairs",
    level: "All levels",
    priceLabel: "Free",
    nextExam: "Open practice set",
    examCount: 12,
    studentCount: 1260,
    participantCount: 755,
    completionLabel: "60% attempted at least one exam",
    outcomes: ["Revise high-frequency facts", "Practice topic-wise MCQs", "Connect current events with core topics"],
    recommendedResources: [
      "Bangladesh constitution summary",
      "Current affairs monthly digest",
      "Liberation War timeline",
    ],
    examTopics: [
      {
        id: "bd-history-review",
        title: "Liberation War Review",
        shortDescription: "Liberation War timeline and historical personalities.",
        scheduledAtLabel: "Friday, 10 July · 7:30 PM",
        status: "Done",
        participantCount: 275,
        topScoreLabel: "39/40",
        topScoreUsername: "toma_gk",
        publicNote: "Exam already done. Public summary is visible; details are locked for enrolled students.",
      },
      {
        id: "constitution-basics",
        title: "Constitution Basics",
        shortDescription: "Articles, amendments, constitutional bodies, and common exam traps.",
        scheduledAtLabel: "Open practice",
        status: "Upcoming",
        publicNote: "Upcoming free practice set with public schedule and topic details.",
      },
      {
        id: "current-affairs-july",
        title: "Current Affairs July Review",
        shortDescription: "Recent government, economy, award, sports, and international updates.",
        scheduledAtLabel: "Friday, 31 July · 7:30 PM",
        status: "Upcoming",
        publicNote: "Future topic is public; exam details unlock after publish.",
      },
    ],
    pastExams: [
      {
        id: "bd-history-01",
        title: "Liberation War Review",
        dateLabel: "10 July 2026",
        syllabusSummary: "Liberation War timeline and historical personalities.",
        liveParticipantCount: 275,
        topScoreLabel: "39/40",
        topScoreUsername: "toma_gk",
      },
    ],
  },
  {
    id: "reasoning-masterclass",
    title: "Reasoning Masterclass",
    description: "Logical reasoning, analogy, series, and analytical practice with weak-zone review.",
    fullDescription:
      "A reasoning route for students who want to turn abstract logic questions into repeatable patterns. The course mixes topic drills with full timed mock exams.",
    fullSyllabus: "Analogy, series, coding-decoding, direction, blood relation, syllogism, and analytical puzzles.",
    teacherId: "tanvir-ahmed",
    teacherName: "Tanvir Ahmed",
    subject: "Reasoning",
    level: "Advanced",
    priceLabel: "BDT 699",
    nextExam: "Monthly full mock",
    examCount: 16,
    studentCount: 980,
    participantCount: 620,
    completionLabel: "63% attempted at least one exam",
    outcomes: ["Recognize logic patterns", "Improve timed reasoning accuracy", "Review weak analytical zones"],
    recommendedResources: [
      "Analytical reasoning practice book",
      "Daily puzzle journal",
      "Previous PSC reasoning questions",
    ],
    examTopics: [
      {
        id: "reasoning-diagnostic",
        title: "Reasoning Diagnostic",
        shortDescription: "Mixed series, analogy, and direction questions.",
        scheduledAtLabel: "Saturday, 11 July · 8:30 PM",
        status: "Done",
        participantCount: 316,
        topScoreLabel: "44/50",
        topScoreUsername: "logic_nahid",
        publicNote: "Exam already done. Details stay locked for non-enrolled students.",
      },
      {
        id: "series-analogy",
        title: "Series And Analogy",
        shortDescription: "Number series, letter series, analogy, and odd-one-out questions.",
        scheduledAtLabel: "Saturday, 25 July · 8:30 PM",
        status: "Upcoming",
        publicNote: "Upcoming exam. Details are visible now; answer/result access stays locked until enrollment.",
      },
      {
        id: "analytical-puzzles",
        title: "Analytical Puzzle Mock",
        shortDescription: "Arrangement, ranking, direction, and multi-step logic questions.",
        scheduledAtLabel: "Saturday, 8 August · 8:30 PM",
        status: "Upcoming",
        publicNote: "Marks and question count stay hidden until publish.",
      },
    ],
    pastExams: [
      {
        id: "reasoning-diagnostic-01",
        title: "Reasoning Diagnostic",
        dateLabel: "11 July 2026",
        syllabusSummary: "Mixed series, analogy, and direction questions.",
        liveParticipantCount: 316,
        topScoreLabel: "44/50",
        topScoreUsername: "logic_nahid",
      },
    ],
  },
];

export const PUBLIC_TEACHERS: PublicTeacher[] = [
  {
    id: "farhana-akter",
    name: "Farhana Akter",
    specialty: "BCS English and language skills",
    bio: "Known for concise grammar lessons, short practice exams, and clear explanations for common mistakes.",
    description:
      "Farhana helps students turn English preparation into small, repeatable practice sessions with clear correction notes and weekly live mocks.",
    institution: "Dhaka Competitive Coaching",
    location: "Dhaka",
    subject: "English",
    studentCount: 1840,
    courseCount: 6,
    popularCourseId: "bcs-english-foundation",
    popularCourseTitle: "BCS English Foundation",
    teachingStyle: ["Grammar-first", "Weekly mocks", "Mistake review"],
  },
  {
    id: "mahbub-hasan",
    name: "Mahbub Hasan",
    specialty: "Math shortcuts for timed exams",
    bio: "Focuses on practical shortcut methods, daily drills, and repeated exam-style practice.",
    description:
      "Mahbub teaches math as a timing problem: recognize the pattern quickly, choose the shortest method, and repeat until it becomes automatic.",
    institution: "Exam Focus Academy",
    location: "Chattogram",
    subject: "Mathematics",
    studentCount: 2300,
    courseCount: 8,
    popularCourseId: "math-shortcut-practice",
    popularCourseTitle: "Math Shortcut Practice",
    teachingStyle: ["Shortcut drills", "Timed sets", "Pattern practice"],
  },
  {
    id: "sadia-rahman",
    name: "Sadia Rahman",
    specialty: "Bangladesh affairs and current events",
    bio: "Builds topic-wise MCQ sets for history, constitution, geography, and recent national updates.",
    description:
      "Sadia organizes broad Bangladesh Affairs topics into compact exam routes so students can revise facts with context instead of memorizing randomly.",
    institution: "Public Service Prep",
    location: "Rajshahi",
    subject: "Bangladesh Affairs",
    studentCount: 1260,
    courseCount: 4,
    popularCourseId: "bangladesh-affairs-mcq",
    popularCourseTitle: "Bangladesh Affairs MCQ",
    teachingStyle: ["Topic maps", "Current updates", "Fact revision"],
  },
  {
    id: "tanvir-ahmed",
    name: "Tanvir Ahmed",
    specialty: "Reasoning and analytical ability",
    bio: "Turns reasoning topics into repeatable patterns students can practice under exam timing.",
    description:
      "Tanvir focuses on reasoning patterns and repeated timed problem sets, helping students understand why they miss certain logic questions.",
    institution: "Independent Teacher",
    location: "Sylhet",
    subject: "Reasoning",
    studentCount: 980,
    courseCount: 5,
    popularCourseId: "reasoning-masterclass",
    popularCourseTitle: "Reasoning Masterclass",
    teachingStyle: ["Pattern recognition", "Puzzle drills", "Weak-zone review"],
  },
];

export const COURSE_FILTERS = ["All", ...Array.from(new Set(PUBLIC_COURSES.map((course) => course.subject)))] as const;
export const TEACHER_FILTERS = [
  "All",
  ...Array.from(new Set(PUBLIC_TEACHERS.map((teacher) => teacher.subject))),
] as const;

export function getPublicCourse(courseId: string) {
  return PUBLIC_COURSES.find((course) => course.id === courseId);
}

export function getPublicTeacher(teacherId: string) {
  return PUBLIC_TEACHERS.find((teacher) => teacher.id === teacherId);
}

export function getCoursesByTeacher(teacherId: string) {
  return PUBLIC_COURSES.filter((course) => course.teacherId === teacherId);
}
