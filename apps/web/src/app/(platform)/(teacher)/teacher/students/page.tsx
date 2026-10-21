import { TeacherStudents } from "@/components/teacher-students";
import { getTeacherStudents } from "@/utils/teacher-access-requests";

export default function TeacherStudentsPage() {
  return <TeacherStudents students={getTeacherStudents("mahbub-hasan")} />;
}
