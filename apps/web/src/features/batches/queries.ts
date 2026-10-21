"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateBatchInput, UpdateBatchInput } from "@exam-taker/validation/batches";
import { teacherCourseKey, teacherCoursesKey } from "@/features/courses/queries";
import {
  createTeacherBatchRequest,
  deleteTeacherBatchRequest,
  getTeacherBatchRequest,
  listTeacherBatchesRequest,
  updateTeacherBatchRequest,
} from "./api";

export const teacherBatchesKey = (courseId: string) => ["teacher", "courses", courseId, "batches"] as const;
export const teacherBatchKey = (courseId: string, batchId: string) =>
  [...teacherBatchesKey(courseId), batchId] as const;

export function useTeacherBatchesQuery(courseId: string) {
  return useQuery({
    queryKey: teacherBatchesKey(courseId),
    queryFn: () => listTeacherBatchesRequest(courseId),
    retry: false,
  });
}

export function useTeacherBatchQuery(courseId: string, batchId: string) {
  return useQuery({
    queryKey: teacherBatchKey(courseId, batchId),
    queryFn: () => getTeacherBatchRequest(courseId, batchId),
    retry: false,
  });
}

function invalidateBatchData(client: ReturnType<typeof useQueryClient>, courseId: string, batchId?: string) {
  client.invalidateQueries({ queryKey: teacherBatchesKey(courseId) });
  client.invalidateQueries({ queryKey: teacherCourseKey(courseId) });
  client.invalidateQueries({ queryKey: teacherCoursesKey });
  if (batchId) client.invalidateQueries({ queryKey: teacherBatchKey(courseId, batchId) });
}

export function useCreateTeacherBatchMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, input }: { courseId: string; input: CreateBatchInput }) =>
      createTeacherBatchRequest(courseId, input),
    onSuccess: (_result, variables) => invalidateBatchData(client, variables.courseId),
  });
}

export function useUpdateTeacherBatchMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, batchId, input }: { courseId: string; batchId: string; input: UpdateBatchInput }) =>
      updateTeacherBatchRequest(courseId, batchId, input),
    onSuccess: (_result, variables) => invalidateBatchData(client, variables.courseId, variables.batchId),
  });
}

export function useDeleteTeacherBatchMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, batchId }: { courseId: string; batchId: string }) =>
      deleteTeacherBatchRequest(courseId, batchId),
    onSuccess: (_result, variables) => {
      invalidateBatchData(client, variables.courseId);
      client.removeQueries({ queryKey: teacherBatchKey(variables.courseId, variables.batchId) });
    },
  });
}
