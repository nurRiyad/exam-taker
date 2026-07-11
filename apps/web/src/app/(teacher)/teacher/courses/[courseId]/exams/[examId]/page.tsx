import { PlaceholderPage } from "@/components/placeholder-page";

type TeacherCourseExamPageProps = {
  params: Promise<{ courseId: string; examId: string }>;
};

export default async function TeacherCourseExamPage({ params }: TeacherCourseExamPageProps) {
  const { courseId, examId } = await params;

  return (
    <PlaceholderPage title="Manage exam" description={`Teacher exam editor placeholder for ${examId} in course ${courseId}.`} />
  );
}