import { PlaceholderPage } from "@/components/placeholder-page";

type StudentCoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function StudentCoursePage({ params }: StudentCoursePageProps) {
  const { courseId } = await params;

  return <PlaceholderPage title="My course" description={`Student course placeholder for ${courseId}.`} />;
}
