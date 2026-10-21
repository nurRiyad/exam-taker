import { TeacherCourseOverview } from "@/components/teacher-course-overview";

type TeacherCoursePageProps = { params: Promise<{ courseId: string }> };

export default async function TeacherCoursePage({ params }: TeacherCoursePageProps) {
  const { courseId } = await params;
  return <TeacherCourseOverview courseId={courseId} />;
}
