import { notFound } from "next/navigation";
import { BatchExamManager } from "@/components/batch-exam-manager";
import { getBatchExams, getCourseBatch } from "@/lib/course-batches";

export default async function BatchExamsPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  const batch = getCourseBatch(courseId, batchId);
  if (!batch) notFound();
  return <BatchExamManager courseId={courseId} batch={batch} exams={getBatchExams(batch)} />;
}
