import { PlaceholderPage } from "@/components/placeholder-page";

type TeacherCourseExamsPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function TeacherCourseExamsPage({ params }: TeacherCourseExamsPageProps) {
  const { courseId } = await params;

  return <PlaceholderPage title="Course exams" description={`Teacher exam list placeholder for course ${courseId}.`} />;
}