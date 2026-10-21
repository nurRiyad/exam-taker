import { TeacherBatchExamPage } from "@/components/teacher-batch-exam-page";

export default async function TeacherBatchPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  return <TeacherBatchExamPage courseId={courseId} batchId={batchId} />;
}
