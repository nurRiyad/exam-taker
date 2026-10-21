import { notFound } from "next/navigation";
import { TeacherExamQuestions } from "@/components/teacher-exam-questions";
import { formatBanglaDate, getBatchExams, getCourseBatch } from "@/utils/course-batches";

export default async function TeacherExamQuestionsPage({
  params,
}: {
  params: Promise<{ courseId: string; batchId: string; examId: string }>;
}) {
  const { courseId, batchId, examId } = await params;
  const batch = getCourseBatch(courseId, batchId);
  const exam = batch && getBatchExams(batch).find((item) => item.id === examId);
  if (!batch || !exam) notFound();

  return (
    <TeacherExamQuestions
      courseId={courseId}
      batchId={batchId}
      examId={examId}
      examTitle={exam.title}
      topic={exam.syllabus[0] ?? "সাধারণ"}
      batchTitle={batch.title}
      examDate={formatBanglaDate(exam.date)}
      examTime={batch.examTime}
      questionCount={exam.questionCount}
      durationMinutes={exam.durationMinutes}
    />
  );
}
