import { PlaceholderPage } from "@/components/placeholder-page";

type StudentCourseJoinPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function StudentCourseJoinPage({ params }: StudentCourseJoinPageProps) {
  const { courseId } = await params;

  return <PlaceholderPage title="Join course" description={`Course join placeholder for ${courseId}.`} />;
}