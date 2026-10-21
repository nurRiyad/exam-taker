import { TeacherCourseEditPage } from "@/components/teacher-course-edit-page";

export default async function EditTeacherCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <TeacherCourseEditPage courseId={courseId} />;
}
