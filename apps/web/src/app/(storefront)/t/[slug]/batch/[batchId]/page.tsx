import { TeacherStorefrontBatch } from "@/components/teacher-storefront/teacher-storefront-batch";

export default async function TeacherBatchPage({ params }: { params: Promise<{ slug: string; batchId: string }> }) {
  const { slug, batchId } = await params;
  return <TeacherStorefrontBatch teacherSlug={slug} batchId={batchId} />;
}
