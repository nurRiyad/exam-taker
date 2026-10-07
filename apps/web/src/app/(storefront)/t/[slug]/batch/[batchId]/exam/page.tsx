import { redirect } from "next/navigation";

export default async function TeacherBatchExamsPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { slug, batchId } = await params;
  redirect(`/t/${slug}/batch/${batchId}`);
}
