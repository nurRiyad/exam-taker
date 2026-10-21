import type { CreateCourseInput, UpdateCourseInput } from "@exam-taker/validation/courses";
import { apiClient, unwrapApiResponse } from "@/utils/api-client";

export type TeacherCourse = CreateCourseInput & { id: string; teacherId: string; status: "খসড়া" | "প্রকাশিত" };
const endpoint = apiClient.demo.teacher.courses;

export async function listTeacherCoursesRequest() {
  const response = await endpoint.$get();
  return unwrapApiResponse<{ courses: TeacherCourse[] }>(response, "কোর্সের তালিকা আনা যায়নি");
}
export async function createTeacherCourseRequest(input: CreateCourseInput) {
  const response = await endpoint.$post({ json: input });
  return unwrapApiResponse<{ course: TeacherCourse }>(response, "কোর্স তৈরি করা যায়নি");
}
export async function updateTeacherCourseRequest(id: string, input: UpdateCourseInput) {
  const response = await endpoint[":id"].$patch({ param: { id }, json: input });
  return unwrapApiResponse<{ course: TeacherCourse }>(response, "কোর্স হালনাগাদ করা যায়নি");
}
export async function deleteTeacherCourseRequest(id: string) {
  const response = await endpoint[":id"].$delete({ param: { id } });
  return unwrapApiResponse<{ deleted: true }>(response, "কোর্স মুছে ফেলা যায়নি");
}
