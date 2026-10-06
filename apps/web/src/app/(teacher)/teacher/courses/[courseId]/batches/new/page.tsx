import { notFound } from "next/navigation";
import { BatchEditorForm } from "@/components/batch-editor-form";
import { getPublicCourse } from "@/lib/public-directory-data";

export default async function NewBatchPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  if (!getPublicCourse(courseId)) notFound();
  return (
    <main className="mx-auto w-full flex-1 px-4 py-8 sm:px-6">
      <BatchEditorForm courseId={courseId} />
    </main>
  );
}
