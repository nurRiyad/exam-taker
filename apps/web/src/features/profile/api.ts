import type { ProfileInput } from "@exam-taker/validation";
import { apiClient, unwrapApiResponse } from "@/utils/api-client";

export async function getProfileRequest() {
  const response = await apiClient.profile.$get();
  return unwrapApiResponse<{ profile: ProfileInput }>(response, "প্রোফাইল আনা যায়নি");
}

export async function updateProfileRequest(input: ProfileInput) {
  const response = await apiClient.profile.$put({ json: input });
  return unwrapApiResponse<{ profile: ProfileInput }>(response, "প্রোফাইল সংরক্ষণ করা যায়নি");
}
