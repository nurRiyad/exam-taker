import { getCoursesByTeacher, getPublicCourse, type PublicCourse } from "@/lib/public-directory-data";

export type CourseBatch = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  status: "চলমান" | "শিগগিরই" | "শেষ";
  studentCount: number;
  firstExamDate: string;
  examIntervalDays: number;
  examTime: string;
  syllabus: string[];
  materials: string[];
};

const seededBatches: CourseBatch[] = [
  {
    id: "bank-morning-2026",
    courseId: "math-shortcut-practice",
    title: "ব্যাংক নিয়োগ · অক্টোবর ব্যাচ",
    description: "ব্যাংক নিয়োগ পরীক্ষার গণিত, মানসিক দক্ষতা ও পূর্ণাঙ্গ মডেল টেস্ট।",
    status: "চলমান",
    studentCount: 342,
    firstExamDate: "2026-10-15",
    examIntervalDays: 4,
    examTime: "রাত ৮:০০",
    syllabus: ["শতকরা ও লাভ-ক্ষতি", "অনুপাত ও সমানুপাত", "সময় ও কাজ", "ব্যাংক নিয়োগ মডেল টেস্ট"],
    materials: ["ব্যাংক গণিত সংক্ষিপ্ত নোট", "বিগত বছরের প্রশ্ন সংকলন"],
  },
  {
    id: "bank-foundation-2026",
    courseId: "math-shortcut-practice",
    title: "ব্যাংক নিয়োগ · বেসিক ব্যাচ",
    description: "ভিত্তি মজবুত করার জন্য ধাপে ধাপে বেসিক গণিত ও সাপ্তাহিক পরীক্ষা।",
    status: "শিগগিরই",
    studentCount: 128,
    firstExamDate: "2026-10-22",
    examIntervalDays: 7,
    examTime: "সন্ধ্যা ৭:৩০",
    syllabus: ["সংখ্যা পদ্ধতি", "ভগ্নাংশ ও দশমিক", "শতকরা", "মৌলিক বীজগণিত"],
    materials: ["বেসিক গণিত ওয়ার্কশিট", "সাপ্তাহিক অনুশীলন সেট"],
  },
  {
    id: "bcs-preli-2026",
    courseId: "bcs-english-foundation",
    title: "৪৭তম বিসিএস · প্রিলিমিনারি ব্যাচ",
    description: "প্রিলিমিনারি ইংরেজি সিলেবাস ধরে টপিকভিত্তিক MCQ ও মডেল পরীক্ষা।",
    status: "চলমান",
    studentCount: 516,
    firstExamDate: "2026-10-16",
    examIntervalDays: 5,
    examTime: "রাত ৯:০০",
    syllabus: ["Parts of Speech", "Tense ও Voice", "Vocabulary", "প্রিলিমিনারি মডেল টেস্ট"],
    materials: ["ইংরেজি ব্যাকরণ নোট", "বিসিএস বিগত প্রশ্ন"],
  },
  {
    id: "bcs-intensive-2026",
    courseId: "bcs-english-foundation",
    title: "বিসিএস ইংরেজি · ইনটেনসিভ ব্যাচ",
    description: "দ্রুত রিভিশন, কঠিন প্রশ্ন এবং ঘন ঘন টাইমড মক পরীক্ষার ব্যাচ।",
    status: "চলমান",
    studentCount: 204,
    firstExamDate: "2026-10-18",
    examIntervalDays: 3,
    examTime: "রাত ১০:০০",
    syllabus: ["Advanced Grammar", "Idioms ও Phrases", "Comprehension", "Full-length Mock"],
    materials: ["ইনটেনসিভ রিভিশন শিট", "দৈনিক MCQ সেট"],
  },
  {
    id: "primary-prep-2026",
    courseId: "reasoning-masterclass",
    title: "প্রাথমিক নিয়োগ · পূর্ণ প্রস্তুতি",
    description: "প্রাথমিক শিক্ষক নিয়োগের যুক্তি, গণিত ও সাধারণ জ্ঞান অনুশীলন।",
    status: "চলমান",
    studentCount: 287,
    firstExamDate: "2026-10-19",
    examIntervalDays: 7,
    examTime: "রাত ৮:৩০",
    syllabus: ["সংখ্যাগত যুক্তি", "বর্ণ ও শব্দের ধারা", "সাধারণ জ্ঞান", "পূর্ণাঙ্গ মডেল টেস্ট"],
    materials: ["যুক্তি অনুশীলন প্যাক", "প্রাথমিক নিয়োগ প্রশ্নব্যাংক"],
  },
];

const seededCourseIds = new Set(seededBatches.map((batch) => batch.courseId));
const generatedBatches: CourseBatch[] = [
  ...getCoursesByTeacher("mahbub-hasan"),
  getPublicCourse("bangladesh-affairs-mcq"),
  getPublicCourse("reasoning-masterclass"),
].flatMap((course, index) => {
  if (!course || seededCourseIds.has(course.id)) return [];
  return [
    {
      id: `${course.id}-fall-2026`,
      courseId: course.id,
      title: `${course.title} · ২০২৬ ব্যাচ`,
      description: `${course.examCategory} পরীক্ষার প্রস্তুতির জন্য স্বতন্ত্র পাঠ্যসূচি ও MCQ মূল্যায়ন।`,
      status: "চলমান" as const,
      studentCount: Math.max(86, Math.round(course.studentCount / (index + 3))),
      firstExamDate: `2026-10-${String(20 + (index % 10)).padStart(2, "0")}`,
      examIntervalDays: index % 2 ? 7 : 5,
      examTime: "রাত ৮:০০",
      syllabus: course.fullSyllabus.split(/,\s*/).slice(0, 5),
      materials: course.recommendedResources.slice(0, 3),
    },
  ];
});

const mockBatches = [...seededBatches, ...generatedBatches];

export function getCourseBatches(courseId: string) {
  return mockBatches.filter((batch) => batch.courseId === courseId);
}

export function getCourseBatch(courseId: string, batchId: string) {
  return mockBatches.find((batch) => batch.courseId === courseId && batch.id === batchId);
}

export function getTeacherCourses(teacherId: string): PublicCourse[] {
  return getCoursesByTeacher(teacherId);
}

export function getCourseForBatch(courseId: string) {
  return getPublicCourse(courseId);
}

export function getBatchExams(batch: CourseBatch) {
  const start = new Date(`${batch.firstExamDate}T12:00:00`);
  const topics = batch.syllabus.filter(
    (item) => !item.includes("মডেল টেস্ট") && !item.includes("Full-length") && !item.includes("Mock"),
  );
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index * batch.examIntervalDays);
    return {
      id: `${batch.id}-exam-${index + 1}`,
      title: index === 0 ? "প্রথম মূল্যায়ন পরীক্ষা" : `${batch.title.split("·")[0].trim()} · পরীক্ষা ${index + 1}`,
      date,
      isPast: date.getTime() < new Date(new Date().toDateString()).getTime(),
      questionCount: 20 + index * 5,
      totalMarks: 20 + index * 5,
      durationMinutes: index % 2 === 0 ? 90 : 120,
      stage:
        date.toDateString() === new Date().toDateString()
          ? ("চলমান" as const)
          : date.getTime() < new Date(new Date().toDateString()).getTime()
            ? ("শেষ" as const)
            : ("আসন্ন" as const),
      syllabus:
        index === 5
          ? [
              ...topics,
              batch.syllabus.find(
                (item) => item.includes("মডেল টেস্ট") || item.includes("Full-length") || item.includes("Mock"),
              ) ?? "পূর্ণাঙ্গ মডেল টেস্ট",
            ]
          : [topics[index % topics.length], topics[(index + 1) % topics.length]].filter(
              (item, topicIndex, list): item is string => Boolean(item) && list.indexOf(item) === topicIndex,
            ),
    };
  });
}

export function formatBanglaDate(date: Date) {
  return new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
