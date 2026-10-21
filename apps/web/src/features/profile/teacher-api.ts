import type { TeacherPublicProfileInput } from "@exam-taker/validation";
import { apiClient, unwrapApiResponse } from "@/utils/api-client";

export async function getTeacherPublicProfileRequest() {
  const response = await apiClient["teacher-profile"].$get();
  return unwrapApiResponse<{ profile: TeacherPublicProfileInput }>(response, "শিক্ষক প্রোফাইল আনা যায়নি");
}

export async function updateTeacherPublicProfileRequest(input: TeacherPublicProfileInput) {
  const response = await apiClient["teacher-profile"].$put({ json: input });
  return unwrapApiResponse<{ profile: TeacherPublicProfileInput }>(response, "প্রোফাইল সংরক্ষণ করা যায়নি");
}
