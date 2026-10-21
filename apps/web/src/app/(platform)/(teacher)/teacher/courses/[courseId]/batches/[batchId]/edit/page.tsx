import { TeacherBatchEditorPage } from "@/components/teacher-batch-editor-page";

export default async function EditBatchPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  return <TeacherBatchEditorPage courseId={courseId} batchId={batchId} />;
}
