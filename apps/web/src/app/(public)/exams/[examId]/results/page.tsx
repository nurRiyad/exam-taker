import { PlaceholderPage } from "@/components/placeholder-page";

type PublicExamResultsPageProps = {
  params: Promise<{ examId: string }>;
};

export default async function PublicExamResultsPage({ params }: PublicExamResultsPageProps) {
  const { examId } = await params;

  return <PlaceholderPage title="Exam results" description={`Public results placeholder for exam ${examId}.`} />;
}
