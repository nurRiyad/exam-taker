import { notFound } from "next/navigation";
import { TeacherStudentAuth } from "@/components/teacher-storefront/teacher-student-auth";
import { getPublicTeacher } from "@/lib/public-directory-data";

export default async function TeacherStudentLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const [{ slug }, { next: rawNext }] = await Promise.all([params, searchParams]);
  const next = Array.isArray(rawNext) ? rawNext[0] : rawNext;
  const teacher = getPublicTeacher(slug);
  if (!teacher) notFound();

  return <TeacherStudentAuth teacher={teacher} mode="login" nextPath={next} />;
}
