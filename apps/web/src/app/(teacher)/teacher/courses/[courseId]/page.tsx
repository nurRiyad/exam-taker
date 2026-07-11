import { PlaceholderPage } from "@/components/placeholder-page";

type TeacherCoursePageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function TeacherCoursePage({ params }: TeacherCoursePageProps) {
  const { courseId } = await params;

  return (
    <PlaceholderPage title="Manage course" description={`Teacher course management placeholder for ${courseId}.`} />
  );
}
