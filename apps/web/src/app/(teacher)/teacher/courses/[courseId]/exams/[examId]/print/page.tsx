import { PlaceholderPage } from "@/components/placeholder-page";

type TeacherCourseExamPrintPageProps = {
  params: Promise<{ courseId: string; examId: string }>;
};

export default async function TeacherCourseExamPrintPage({ params }: TeacherCourseExamPrintPageProps) {
  const { courseId, examId } = await params;

  return <PlaceholderPage title="Print exam" description={`Print/PDF placeholder for exam ${examId} in course ${courseId}.`} />;
}