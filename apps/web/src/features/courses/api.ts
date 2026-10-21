import type { CreateCourseInput, UpdateCourseInput } from "@exam-taker/validation/courses";
import { apiClient, unwrapApiResponse } from "@/utils/api-client";

export type TeacherCourse = {
  id: string;
  tenantId: string;
  title: string;
  shortDescription: string | null;
  fullSyllabus: string | null;
  basePriceBdt: number;
  isFree: boolean;
  discountPercent: number | null;
  discountStartAt: string | null;
  discountEndAt: string | null;
  status: "draft" | "published" | "archived";
  createdAt: string;
};

export type TeacherCourseBatch = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  isDefault: boolean;
  status: "upcoming" | "active" | "completed";
  capacity: number | null;
  syllabus: string | null;
  materials: string | null;
  firstExamDate: string | null;
  examTime: string | null;
  examIntervalDays: number | null;
  createdAt: string;
};

export async function listTeacherCoursesRequest() {
  const response = await apiClient.teacher.courses.$get();
  return unwrapApiResponse<{ courses: TeacherCourse[] }>(response, "কোর্সের তালিকা আনা যায়নি");
}

export async function getTeacherCourseRequest(id: string) {
  const response = await apiClient.teacher.courses[":id"].$get({ param: { id } });
  return unwrapApiResponse<{ course: TeacherCourse; batches: TeacherCourseBatch[] }>(
    response,
    "কোর্সের তথ্য আনা যায়নি",
  );
}

export async function createTeacherCourseRequest(input: CreateCourseInput) {
  const response = await apiClient.courses.$post({ json: input });
  return unwrapApiResponse<{ course: TeacherCourse }>(response, "কোর্স তৈরি করা যায়নি");
}
export async function updateTeacherCourseRequest(id: string, input: UpdateCourseInput) {
  const response = await apiClient.courses[":id"].$patch({ param: { id }, json: input });
  return unwrapApiResponse<{ course: TeacherCourse }>(response, "কোর্স হালনাগাদ করা যায়নি");
}
export async function deleteTeacherCourseRequest(id: string) {
  const response = await apiClient.courses[":id"].$delete({ param: { id } });
  return unwrapApiResponse<{ deleted: true }>(response, "কোর্স মুছে ফেলা যায়নি");
}
