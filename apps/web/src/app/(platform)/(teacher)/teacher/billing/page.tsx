import { notFound } from "next/navigation";
import { TeacherAccessRequests } from "@/components/teacher-access-requests";
import { getTeacherCourses } from "@/utils/course-batches";
import { getTeacherAccessRequests } from "@/utils/teacher-access-requests";

export default function TeacherBillingPage() {
  const courses = getTeacherCourses("kafi");
  if (!courses.length) notFound();
  return <TeacherAccessRequests initialRequests={getTeacherAccessRequests("kafi")} />;
}
