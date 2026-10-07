import { notFound } from "next/navigation";
import { TeacherStorefrontCourse } from "@/components/teacher-storefront/teacher-storefront-course";
import { getPublicCourse, getPublicTeacher } from "@/lib/public-directory-data";

export default async function TeacherCoursePage({ params }: { params: Promise<{ slug: string; courseId: string }> }) {
  const { slug, courseId } = await params;
  const teacher = getPublicTeacher(slug);
  const course = getPublicCourse(courseId);
  if (!teacher || !course || course.teacherId !== teacher.id) notFound();

  return <TeacherStorefrontCourse teacher={teacher} course={course} />;
}
