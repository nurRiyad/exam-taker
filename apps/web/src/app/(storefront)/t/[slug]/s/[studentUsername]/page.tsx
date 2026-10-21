import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentTeacherDashboard } from "@/components/teacher-storefront/student-teacher-dashboard";
import { getPublicTeacher } from "@/utils/public-directory-data";

type StudentDashboardPageProps = { params: Promise<{ slug: string; studentUsername: string }> };

export async function generateMetadata({ params }: StudentDashboardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const teacher = getPublicTeacher(slug);
  return teacher ? { title: `শিক্ষার্থী ড্যাশবোর্ড | ${teacher.name}` } : { title: "শিক্ষক খুঁজে পাওয়া যায়নি" };
}

export default async function StudentDashboardPage({ params }: StudentDashboardPageProps) {
  const { slug, studentUsername } = await params;
  const teacher = getPublicTeacher(slug);
  if (!teacher) notFound();

  return <StudentTeacherDashboard teacher={teacher} studentUsername={studentUsername} />;
}
