import { BatchEditorForm } from "@/components/batch-editor-form";

export default async function NewBatchPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <BatchEditorForm courseId={courseId} />
    </main>
  );
}
