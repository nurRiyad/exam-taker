import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeacherStorefront } from "@/components/teacher-storefront/teacher-storefront";
import { getCourseBatches } from "@/lib/course-batches";
import { getCoursesByTeacher, getPublicTeacher } from "@/lib/public-directory-data";

type TeacherStorefrontPageProps = { params: Promise<{ slug: string }> };

function getTeacherBySlug(slug: string) {
  return getPublicTeacher(slug);
}

export async function generateMetadata({ params }: TeacherStorefrontPageProps): Promise<Metadata> {
  const { slug } = await params;
  const teacher = getTeacherBySlug(slug);

  return teacher
    ? { title: `${teacher.name} | Exam Taker`, description: teacher.description }
    : { title: "শিক্ষক খুঁজে পাওয়া যায়নি | Exam Taker" };
}

export default async function TeacherStorefrontPage({ params }: TeacherStorefrontPageProps) {
  const { slug } = await params;
  const teacher = getTeacherBySlug(slug);

  if (!teacher) notFound();

  const courses = getCoursesByTeacher(teacher.id).map((course) => ({
    ...course,
    batches: getCourseBatches(course.id),
  }));

  return <TeacherStorefront teacher={teacher} courses={courses} />;
}
