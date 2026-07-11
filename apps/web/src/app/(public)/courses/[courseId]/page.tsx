import { PlaceholderPage } from "@/components/placeholder-page";

type CourseDetailsPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { courseId } = await params;

  return <PlaceholderPage title="Course details" description={`Public course detail placeholder for ${courseId}.`} />;
}