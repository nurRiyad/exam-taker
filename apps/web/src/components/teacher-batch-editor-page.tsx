"use client";

import { Button } from "@/components/ui/button";
import { BatchEditorForm } from "@/components/batch-editor-form";
import { useTeacherBatchQuery } from "@/features/batches/queries";

export function TeacherBatchEditorPage({ courseId, batchId }: { courseId: string; batchId: string }) {
  const query = useTeacherBatchQuery(courseId, batchId);
  if (query.isPending)
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6" role="status">
        ব্যাচের তথ্য লোড হচ্ছে…
      </main>
    );
  if (query.isError || !query.data)
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start gap-3 px-4 py-8 sm:px-6">
        <p role="alert" className="text-sm text-destructive">
          ব্যাচের তথ্য আনা যায়নি। আবার চেষ্টা করুন।
        </p>
        <Button type="button" variant="outline" onClick={() => query.refetch()}>
          আবার চেষ্টা
        </Button>
      </main>
    );
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <BatchEditorForm key={query.data.batch.id} courseId={courseId} batch={query.data.batch} />
    </main>
  );
}
