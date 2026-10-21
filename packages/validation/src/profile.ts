import { z } from "zod";
import { phoneLocalSchema } from "./auth";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "পূর্ণ নাম লিখুন").max(100, "নাম ১০০ অক্ষরের মধ্যে লিখুন"),
  phone: phoneLocalSchema,
  division: z.string().trim().min(1, "বিভাগ নির্বাচন করুন"),
  district: z.string().trim().min(1, "জেলা লিখুন").max(80, "জেলার নাম ৮০ অক্ষরের মধ্যে লিখুন"),
  address: z.string().trim().min(1, "ঠিকানা লিখুন").max(250, "ঠিকানা ২৫০ অক্ষরের মধ্যে লিখুন"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
