"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  checkUsernameAvailabilityRequest,
  currentUserRequest,
  generateResetCodeRequest,
  loginRequest,
  logoutRequest,
  resetPasswordRequest,
  signupRequest,
} from "./api";

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "me"] as const,
  usernameAvailability: (username: string) => [...authKeys.all, "username-availability", username] as const,
};

export function useCurrentUserQuery(enabled = true) {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: currentUserRequest,
    enabled,
    retry: false,
  });
}

export function useUsernameAvailabilityQuery(username: string, enabled: boolean) {
  return useQuery({
    queryKey: authKeys.usernameAvailability(username),
    queryFn: () => checkUsernameAvailabilityRequest(username),
    enabled,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.currentUser() }),
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signupRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.currentUser() }),
  });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPasswordRequest });
}

export function useGenerateResetCodeMutation() {
  return useMutation({ mutationFn: generateResetCodeRequest });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => queryClient.removeQueries({ queryKey: authKeys.currentUser() }),
  });
}
