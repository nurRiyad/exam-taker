import type { CreateBatchInput, UpdateBatchInput } from "@exam-taker/validation/batches";
import { apiClient, unwrapApiResponse } from "@/utils/api-client";
import type { TeacherCourseBatch } from "@/features/courses/api";

export type TeacherBatch = Omit<TeacherCourseBatch, "syllabus" | "materials"> & {
  syllabus: string | null;
  materials: string | null;
};

export async function listTeacherBatchesRequest(courseId: string) {
  const response = await apiClient.teacher.courses[":courseId"].batches.$get({ param: { courseId } });
  return unwrapApiResponse<{ batches: TeacherBatch[] }>(response, "ব্যাচের তালিকা আনা যায়নি");
}

export async function getTeacherBatchRequest(courseId: string, batchId: string) {
  const response = await apiClient.teacher.courses[":courseId"].batches[":batchId"].$get({
    param: { courseId, batchId },
  });
  return unwrapApiResponse<{ batch: TeacherBatch }>(response, "ব্যাচের তথ্য আনা যায়নি");
}

export async function createTeacherBatchRequest(courseId: string, input: CreateBatchInput) {
  const response = await apiClient.teacher.courses[":courseId"].batches.$post({ param: { courseId }, json: input });
  return unwrapApiResponse<{ batch: TeacherBatch }>(response, "ব্যাচ তৈরি করা যায়নি");
}

export async function updateTeacherBatchRequest(courseId: string, batchId: string, input: UpdateBatchInput) {
  const response = await apiClient.teacher.courses[":courseId"].batches[":batchId"].$patch({
    param: { courseId, batchId },
    json: input,
  });
  return unwrapApiResponse<{ batch: TeacherBatch }>(response, "ব্যাচ হালনাগাদ করা যায়নি");
}

export async function deleteTeacherBatchRequest(courseId: string, batchId: string) {
  const response = await apiClient.teacher.courses[":courseId"].batches[":batchId"].$delete({
    param: { courseId, batchId },
  });
  return unwrapApiResponse<{ deleted: true }>(response, "ব্যাচ মুছে ফেলা যায়নি");
}
