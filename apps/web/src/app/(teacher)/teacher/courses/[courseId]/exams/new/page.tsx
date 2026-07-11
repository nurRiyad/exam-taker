import { PlaceholderPage } from "@/components/placeholder-page";

type NewTeacherCourseExamPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function NewTeacherCourseExamPage({ params }: NewTeacherCourseExamPageProps) {
  const { courseId } = await params;

  return <PlaceholderPage title="New exam" description={`Exam creation placeholder for course ${courseId}.`} />;
}