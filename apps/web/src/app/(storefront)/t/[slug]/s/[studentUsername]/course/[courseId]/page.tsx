import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentCourseProgress } from "@/components/teacher-storefront/student-course-progress";
import { getPublicCourse, getPublicTeacher } from "@/lib/public-directory-data";

type StudentCoursePageProps = { params: Promise<{ slug: string; studentUsername: string; courseId: string }> };

export async function generateMetadata({ params }: StudentCoursePageProps): Promise<Metadata> {
  const { slug, courseId } = await params;
  const teacher = getPublicTeacher(slug);
  const course = getPublicCourse(courseId);
  return teacher && course?.teacherId === teacher.id
    ? { title: `কোর্সের অগ্রগতি | ${course.title} | ${teacher.name}` }
    : { title: "কোর্স খুঁজে পাওয়া যায়নি" };
}

export default async function StudentCoursePage({ params }: StudentCoursePageProps) {
  const { slug, studentUsername, courseId } = await params;
  const teacher = getPublicTeacher(slug);
  const course = getPublicCourse(courseId);
  if (!teacher || !course || course.teacherId !== teacher.id) notFound();

  return <StudentCourseProgress teacher={teacher} course={course} studentUsername={studentUsername} />;
}
