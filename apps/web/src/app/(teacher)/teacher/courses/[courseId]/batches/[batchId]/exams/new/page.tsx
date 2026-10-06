import { notFound } from "next/navigation";
import { NewBatchExamForm } from "@/components/new-batch-exam-form";
import { getCourseBatch } from "@/lib/course-batches";

export default async function NewBatchExamPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  const batch = getCourseBatch(courseId, batchId);
  if (!batch) notFound();
  return <NewBatchExamForm courseId={courseId} batch={batch} />;
}
