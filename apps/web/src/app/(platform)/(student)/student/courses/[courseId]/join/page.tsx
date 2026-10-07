import { notFound } from "next/navigation";
import { BatchJoinPanel } from "@/components/batch-join-panel";
import { getCourseBatches } from "@/lib/course-batches";
import { getPublicCourse } from "@/lib/public-directory-data";

export default async function StudentCourseJoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ batchId?: string }>;
}) {
  const [{ courseId }, query] = await Promise.all([params, searchParams]);
  const course = getPublicCourse(courseId);
  if (!course) notFound();
  const batches = getCourseBatches(course.id);
  return (
    <main className="mx-auto flex w-full flex-1 justify-center px-4 py-8 sm:px-6">
      <BatchJoinPanel courseId={course.id} batches={batches} selectedBatchId={query.batchId} />
    </main>
  );
}
