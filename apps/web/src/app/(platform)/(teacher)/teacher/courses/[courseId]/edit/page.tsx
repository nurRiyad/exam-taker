import { notFound } from "next/navigation";
import { LocalCourseEditor } from "@/components/local-course-editor";
import { getPublicCourse } from "@/utils/public-directory-data";

export default async function EditTeacherCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getPublicCourse(courseId);
  if (!course) notFound();
  return <LocalCourseEditor course={course} />;
}
