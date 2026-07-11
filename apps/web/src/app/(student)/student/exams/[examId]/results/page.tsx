import { PlaceholderPage } from "@/components/placeholder-page";

type StudentExamResultsPageProps = {
  params: Promise<{ examId: string }>;
};

export default async function StudentExamResultsPage({ params }: StudentExamResultsPageProps) {
  const { examId } = await params;

  return <PlaceholderPage title="My exam results" description={`Student result placeholder for exam ${examId}.`} />;
}