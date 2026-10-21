import type { CreateCourseInput, UpdateCourseInput } from "@exam-taker/validation/courses";

export type DemoTeacherCourse = CreateCourseInput & { id: string; teacherId: string; status: "খসড়া" | "প্রকাশিত" };

let courses: DemoTeacherCourse[] = [
  {
    id: "math-shortcut-practice",
    teacherId: "kafi",
    title: "গণিত শর্টকাট অনুশীলন",
    shortDescription: "ব্যাংক ও সরকারি চাকরির পরীক্ষার জন্য গণিত অনুশীলন।",
    fullSyllabus: "শতকরা, অনুপাত, সময় ও কাজ, বীজগণিত",
    basePriceBdt: 599,
    isFree: false,
    status: "প্রকাশিত",
  },
  {
    id: "bangladesh-affairs-mcq",
    teacherId: "kafi",
    title: "বাংলাদেশ বিষয়াবলি MCQ",
    shortDescription: "ইতিহাস, সংবিধান ও সাম্প্রতিক বিষয়।",
    fullSyllabus: "ইতিহাস, সংবিধান, ভূগোল ও সাম্প্রতিক তথ্য",
    basePriceBdt: 0,
    isFree: true,
    status: "খসড়া",
  },
];

export function listDemoCourses(teacherId: string) {
  return courses.filter((course) => course.teacherId === teacherId).map((course) => ({ ...course }));
}
export function createDemoCourse(input: CreateCourseInput, teacherId: string) {
  const course: DemoTeacherCourse = { ...input, id: `demo-course-${crypto.randomUUID()}`, teacherId, status: "খসড়া" };
  courses = [...courses, course];
  return { ...course };
}
export function updateDemoCourse(id: string, teacherId: string, input: UpdateCourseInput) {
  const existing = courses.find((course) => course.id === id && course.teacherId === teacherId);
  if (!existing) return undefined;
  Object.assign(existing, input);
  return { ...existing };
}
export function deleteDemoCourse(id: string, teacherId: string) {
  const existing = courses.find((course) => course.id === id && course.teacherId === teacherId);
  if (!existing) return false;
  courses = courses.filter((course) => course.id !== id);
  return true;
}
