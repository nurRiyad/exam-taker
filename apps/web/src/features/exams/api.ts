import type { CreateExamInput, UpdateExamInput } from "@exam-taker/validation/exams";
import { apiClient, unwrapApiResponse } from "@/utils/api-client";

export type TeacherExam = {
  id: string;
  batchId: string;
  tenantId: string;
  courseId: string;
  title: string;
  description: string | null;
  topicText: string | null;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  totalMarks: number | null;
  markPerCorrect: number;
  negativeMarkingEnabled: boolean;
  negativeMarkPerWrong: number;
  answerChangeAllowed: boolean;
  autosaveEnabled: boolean;
  mockEnabled: boolean;
  mockRetryLimit: number | null;
  resultReleaseMode: string;
  resultReleaseAt: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
};

export async function listTeacherExamsRequest(courseId: string, batchId: string) {
  const response = await apiClient.teacher.courses[":courseId"].batches[":batchId"].exams.$get({
    param: { courseId, batchId },
  });
  return unwrapApiResponse<{ exams: TeacherExam[] }>(response, "পরীক্ষার তালিকা আনা যায়নি");
}

export async function getTeacherExamRequest(courseId: string, batchId: string, examId: string) {
  const response = await apiClient.teacher.courses[":courseId"].batches[":batchId"].exams[":examId"].$get({
    param: { courseId, batchId, examId },
  });
  return unwrapApiResponse<{ exam: TeacherExam }>(response, "পরীক্ষার তথ্য আনা যায়নি");
}

export async function createTeacherExamRequest(courseId: string, batchId: string, input: CreateExamInput) {
  const response = await apiClient.teacher.courses[":courseId"].batches[":batchId"].exams.$post({
    param: { courseId, batchId },
    json: input,
  });
  return unwrapApiResponse<{ exam: TeacherExam }>(response, "পরীক্ষা তৈরি করা যায়নি");
}

export async function updateTeacherExamRequest(
  courseId: string,
  batchId: string,
  examId: string,
  input: UpdateExamInput,
) {
  const response = await apiClient.teacher.courses[":courseId"].batches[":batchId"].exams[":examId"].$patch({
    param: { courseId, batchId, examId },
    json: input,
  });
  return unwrapApiResponse<{ exam: TeacherExam }>(response, "পরীক্ষা হালনাগাদ করা যায়নি");
}

export async function deleteTeacherExamRequest(courseId: string, batchId: string, examId: string) {
  const response = await apiClient.teacher.courses[":courseId"].batches[":batchId"].exams[":examId"].$delete({
    param: { courseId, batchId, examId },
  });
  return unwrapApiResponse<{ deleted: true }>(response, "পরীক্ষা মুছে ফেলা যায়নি");
}
