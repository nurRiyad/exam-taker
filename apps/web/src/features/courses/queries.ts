"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCourseInput, UpdateCourseInput } from "@exam-taker/validation/courses";
import {
  createTeacherCourseRequest,
  deleteTeacherCourseRequest,
  listTeacherCoursesRequest,
  updateTeacherCourseRequest,
} from "./api";

export const teacherCoursesKey = ["teacher", "courses"] as const;
export function useTeacherCoursesQuery() {
  return useQuery({ queryKey: teacherCoursesKey, queryFn: listTeacherCoursesRequest, retry: false });
}
export function useCreateTeacherCourseMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCourseInput) => createTeacherCourseRequest(input),
    onSuccess: () => client.invalidateQueries({ queryKey: teacherCoursesKey }),
  });
}
export function useUpdateTeacherCourseMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCourseInput }) => updateTeacherCourseRequest(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: teacherCoursesKey }),
  });
}
export function useDeleteTeacherCourseMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteTeacherCourseRequest,
    onSuccess: () => client.invalidateQueries({ queryKey: teacherCoursesKey }),
  });
}
