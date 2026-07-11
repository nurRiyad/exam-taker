import { PlaceholderPage } from "@/components/placeholder-page";

type TeacherDetailsPageProps = {
  params: Promise<{ teacherId: string }>;
};

export default async function TeacherDetailsPage({ params }: TeacherDetailsPageProps) {
  const { teacherId } = await params;

  return <PlaceholderPage title="Teacher details" description={`Public teacher profile placeholder for ${teacherId}.`} />;
}