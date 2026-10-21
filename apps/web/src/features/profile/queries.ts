"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProfileInput } from "@exam-taker/validation";
import { getProfileRequest, updateProfileRequest } from "./api";

export const profileKey = ["profile", "me"] as const;

export function useProfileQuery() {
  return useQuery({ queryKey: profileKey, queryFn: getProfileRequest, retry: false });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileInput) => updateProfileRequest(input),
    onSuccess: (result) => queryClient.setQueryData(profileKey, result),
  });
}
