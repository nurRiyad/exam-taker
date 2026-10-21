import { apiClient, unwrapApiResponse } from "@/utils/api-client";
import { extractApiError } from "@/utils/api-error";
import type { LoginInput, RedeemResetCodeInput, SignupInput } from "@exam-taker/validation";

export async function loginRequest(input: LoginInput) {
  const response = await apiClient.auth.login.$post({ json: input });
  if (!response.ok) {
    const { message } = await extractApiError(
      response,
      response.status === 401 ? "ব্যবহারকারীর নাম/ফোন অথবা পাসওয়ার্ড সঠিক নয়" : "লগইন করা যায়নি। আবার চেষ্টা করুন।",
    );
    throw new Error(message);
  }
  return response.json();
}

export async function signupRequest(input: SignupInput) {
  const response = await apiClient.auth.signup.$post({ json: input });
  if (!response.ok) {
    const { message, fields } = await extractApiError(response, "Could not create your account.");
    throw Object.assign(new Error(message), { fields });
  }
  return response.json();
}

export async function checkUsernameAvailabilityRequest(username: string) {
  const response = await apiClient.auth["username-availability"].$get({ query: { username } });
  return unwrapApiResponse<{ available: boolean }>(response, "ব্যবহারকারীর নাম যাচাই করা যায়নি");
}

export async function resetPasswordRequest(input: RedeemResetCodeInput) {
  const response = await apiClient.auth.reset.$post({ json: input });
  return unwrapApiResponse<{ ok: true }>(response, "Invalid or expired reset code");
}

export async function generateResetCodeRequest(userId: string) {
  const response = await apiClient.auth["reset-codes"].$post({ json: { userId } });
  return unwrapApiResponse<{ code: string }>(response, "Could not generate a reset code.");
}

export async function currentUserRequest() {
  const response = await apiClient.auth.me.$get();
  return unwrapApiResponse<{ user: { id: string; name: string | null; username: string; role: string } }>(
    response,
    "সেশন যাচাই করা যায়নি",
  );
}

export async function logoutRequest() {
  await apiClient.auth.logout.$post();
}
