import { TeacherExamEditorPage } from "@/components/teacher-exam-editor-page";

export default async function BatchExamPage({
  params,
}: {
  params: Promise<{ courseId: string; batchId: string; examId: string }>;
}) {
  const { courseId, batchId, examId } = await params;
  return <TeacherExamEditorPage courseId={courseId} batchId={batchId} examId={examId} />;
}
