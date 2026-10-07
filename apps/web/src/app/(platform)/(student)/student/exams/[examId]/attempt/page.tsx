import { notFound } from "next/navigation";
import { ExamAttempt } from "@/components/exam-attempt";

type StudentExamAttemptPageProps = {
  params: Promise<{ examId: string }>;
};

export default async function StudentExamAttemptPage({ params }: StudentExamAttemptPageProps) {
  const { examId } = await params;
  if (!examId) notFound();

  return <ExamAttempt examId={examId} />;
}
