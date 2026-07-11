import { PlaceholderPage } from "@/components/placeholder-page";

type StudentExamAttemptPageProps = {
  params: Promise<{ examId: string }>;
};

export default async function StudentExamAttemptPage({ params }: StudentExamAttemptPageProps) {
  const { examId } = await params;

  return <PlaceholderPage title="Exam attempt" description={`Live exam attempt placeholder for ${examId}.`} />;
}