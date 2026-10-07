import { notFound } from "next/navigation";
import { ExamAttempt } from "@/components/exam-attempt";
import { getBatchExams, getCourseBatch } from "@/lib/course-batches";
import { getCoursesByTeacher, getPublicTeacher } from "@/lib/public-directory-data";
import { getStorefrontCourseCopy } from "@/components/teacher-storefront/content";

export default async function TeacherMcqPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string; examId: string }>;
}) {
  const { slug, batchId, examId } = await params;
  const teacher = getPublicTeacher(slug);
  if (!teacher) notFound();
  const course = getCoursesByTeacher(teacher.id).find((item) => getCourseBatch(item.id, batchId));
  const batch = course ? getCourseBatch(course.id, batchId) : undefined;
  if (!course || !batch) notFound();
  const exam = getBatchExams(batch).find((item) => item.id === examId);
  if (!exam) notFound();

  return (
    <ExamAttempt
      examId={exam.id}
      examTitle={exam.title}
      courseTitle={getStorefrontCourseCopy(course).title}
      returnHref={`/t/${slug}/batch/${batchId}/exam`}
      durationMinutes={exam.durationMinutes}
      questionCount={exam.questionCount}
    />
  );
}
