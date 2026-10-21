"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateExamInput, UpdateExamInput } from "@exam-taker/validation/exams";
import { teacherBatchesKey, teacherBatchKey } from "@/features/batches/queries";
import {
  createTeacherExamRequest,
  deleteTeacherExamRequest,
  getTeacherExamRequest,
  listTeacherExamsRequest,
  updateTeacherExamRequest,
} from "./api";

export const teacherExamsKey = (courseId: string, batchId: string) =>
  ["teacher", "courses", courseId, "batches", batchId, "exams"] as const;
export const teacherExamKey = (courseId: string, batchId: string, examId: string) =>
  [...teacherExamsKey(courseId, batchId), examId] as const;

export function useTeacherExamsQuery(courseId: string, batchId: string) {
  return useQuery({
    queryKey: teacherExamsKey(courseId, batchId),
    queryFn: () => listTeacherExamsRequest(courseId, batchId),
    retry: false,
  });
}

export function useTeacherExamQuery(courseId: string, batchId: string, examId: string, enabled = true) {
  return useQuery({
    queryKey: teacherExamKey(courseId, batchId, examId),
    queryFn: () => getTeacherExamRequest(courseId, batchId, examId),
    retry: false,
    enabled,
  });
}

function invalidateExamData(
  client: ReturnType<typeof useQueryClient>,
  courseId: string,
  batchId: string,
  examId?: string,
) {
  client.invalidateQueries({ queryKey: teacherExamsKey(courseId, batchId) });
  client.invalidateQueries({ queryKey: teacherBatchKey(courseId, batchId) });
  client.invalidateQueries({ queryKey: teacherBatchesKey(courseId) });
  if (examId) client.invalidateQueries({ queryKey: teacherExamKey(courseId, batchId, examId) });
}

export function useCreateTeacherExamMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, batchId, input }: { courseId: string; batchId: string; input: CreateExamInput }) =>
      createTeacherExamRequest(courseId, batchId, input),
    onSuccess: (_result, variables) => invalidateExamData(client, variables.courseId, variables.batchId),
  });
}

export function useUpdateTeacherExamMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      batchId,
      examId,
      input,
    }: {
      courseId: string;
      batchId: string;
      examId: string;
      input: UpdateExamInput;
    }) => updateTeacherExamRequest(courseId, batchId, examId, input),
    onSuccess: (_result, variables) =>
      invalidateExamData(client, variables.courseId, variables.batchId, variables.examId),
  });
}

export function useDeleteTeacherExamMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, batchId, examId }: { courseId: string; batchId: string; examId: string }) =>
      deleteTeacherExamRequest(courseId, batchId, examId),
    onSuccess: (_result, variables) => {
      invalidateExamData(client, variables.courseId, variables.batchId);
      client.removeQueries({ queryKey: teacherExamKey(variables.courseId, variables.batchId, variables.examId) });
    },
  });
}
