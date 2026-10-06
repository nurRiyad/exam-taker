import { notFound } from "next/navigation";
import { BatchEditorForm } from "@/components/batch-editor-form";
import { getCourseBatch } from "@/lib/course-batches";

export default async function EditBatchPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  const batch = getCourseBatch(courseId, batchId);
  if (!batch) notFound();
  return (
    <main className="mx-auto w-full flex-1 px-4 py-8 sm:px-6">
      <BatchEditorForm courseId={courseId} batch={batch} />
    </main>
  );
}
