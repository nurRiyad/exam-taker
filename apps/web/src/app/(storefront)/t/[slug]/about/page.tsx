import { notFound } from "next/navigation";
import { TeacherStorefrontProfile } from "@/components/teacher-storefront/teacher-storefront-profile";
import { getPublicTeacher } from "@/lib/public-directory-data";

export default async function TeacherAboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const teacher = getPublicTeacher(slug);
  if (!teacher) notFound();

  return <TeacherStorefrontProfile teacher={teacher} />;
}
