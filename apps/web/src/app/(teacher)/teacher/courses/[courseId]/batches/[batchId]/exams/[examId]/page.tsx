import { notFound } from "next/navigation";
import { getBatchExams, getCourseBatch } from "@/lib/course-batches";
import { ExamDetailsForm } from "@/components/exam-details-form";

export default async function BatchExamPage({
  params,
}: {
  params: Promise<{ courseId: string; batchId: string; examId: string }>;
}) {
  const { courseId, batchId, examId } = await params;
  const batch = getCourseBatch(courseId, batchId);
  const exam = batch && getBatchExams(batch).find((item) => item.id === examId);
  if (!batch || !exam) notFound();
  return (
    <ExamDetailsForm
      courseId={courseId}
      batch={batch}
      exam={{ id: exam.id, title: exam.title, date: exam.date.toISOString().slice(0, 10) }}
    />
  );
}
