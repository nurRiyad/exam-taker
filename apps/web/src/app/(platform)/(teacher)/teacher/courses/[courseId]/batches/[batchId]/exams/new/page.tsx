import { TeacherExamEditorPage } from "@/components/teacher-exam-editor-page";

export default async function NewBatchExamPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  return <TeacherExamEditorPage courseId={courseId} batchId={batchId} />;
}
