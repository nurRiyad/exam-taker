import { notFound } from "next/navigation";
import { TeacherBatchDirectory } from "@/components/teacher-batch-directory";
import { getBatchExams, getCourseBatches, getTeacherCourses, formatBanglaDate } from "@/lib/course-batches";

const TEACHER_ID = "mahbub-hasan";

export default function TeacherBatchesPage() {
  const courses = getTeacherCourses(TEACHER_ID);
  if (!courses.length) notFound();
  const courseOptions = courses.map(({ id, title }) => ({ id, title }));
  const batches = courses.flatMap((course) =>
    getCourseBatches(course.id).map((batch) => {
      const nextExam = getBatchExams(batch).find((exam) => !exam.isPast);
      return {
        id: batch.id,
        title: batch.title,
        courseId: course.id,
        courseTitle: course.title,
        status: batch.status,
        studentCount: batch.studentCount,
        nextExamDate: nextExam?.date.toISOString() ?? "",
        nextExamLabel: nextExam ? formatBanglaDate(nextExam.date) : "নির্ধারিত নয়",
        href: `/teacher/courses/${course.id}/batches/${batch.id}`,
      };
    }),
  );

  return <TeacherBatchDirectory batches={batches} courses={courseOptions} />;
}
