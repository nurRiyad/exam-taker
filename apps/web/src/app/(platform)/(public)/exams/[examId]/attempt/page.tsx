import { notFound } from "next/navigation";
import { ExamAttempt } from "@/components/exam-attempt";

export default async function PublicExamAttemptPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  if (!examId) notFound();
  return <ExamAttempt examId={examId} />;
}
