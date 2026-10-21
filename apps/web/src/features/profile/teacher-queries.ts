"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TeacherPublicProfileInput } from "@exam-taker/validation";
import { getTeacherPublicProfileRequest, updateTeacherPublicProfileRequest } from "./teacher-api";

export const teacherPublicProfileKey = ["teacher-profile", "me"] as const;

export function useTeacherPublicProfileQuery() {
  return useQuery({ queryKey: teacherPublicProfileKey, queryFn: getTeacherPublicProfileRequest, retry: false });
}

export function useUpdateTeacherPublicProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TeacherPublicProfileInput) => updateTeacherPublicProfileRequest(input),
    onSuccess: (result) => queryClient.setQueryData(teacherPublicProfileKey, result),
  });
}
