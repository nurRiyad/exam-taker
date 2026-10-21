import { z } from "zod";

export const teacherPublicProfileSchema = z.object({
  name: z.string().trim().min(2, "নাম লিখুন").max(100, "নাম ১০০ অক্ষরের মধ্যে লিখুন"),
  specialty: z.string().trim().min(2, "পড়ানোর বিষয় লিখুন").max(120, "বিষয় ১২০ অক্ষরের মধ্যে লিখুন"),
  bio: z.string().trim().min(10, "সংক্ষিপ্ত পরিচিতি অন্তত ১০ অক্ষরে লিখুন").max(500, "পরিচিতি ৫০০ অক্ষরের মধ্যে লিখুন"),
  description: z
    .string()
    .trim()
    .min(10, "বিস্তারিত পরিচিতি অন্তত ১০ অক্ষরে লিখুন")
    .max(2000, "পরিচিতি ২০০০ অক্ষরের মধ্যে লিখুন"),
  institution: z.string().trim().min(2, "প্রতিষ্ঠানের নাম লিখুন").max(160, "প্রতিষ্ঠানের নাম ১৬০ অক্ষরের মধ্যে লিখুন"),
  location: z.string().trim().min(2, "অবস্থান লিখুন").max(120, "অবস্থান ১২০ অক্ষরের মধ্যে লিখুন"),
  subject: z.string().trim().min(2, "প্রধান বিষয় লিখুন").max(100, "বিষয় ১০০ অক্ষরের মধ্যে লিখুন"),
});

export type TeacherPublicProfileInput = z.infer<typeof teacherPublicProfileSchema>;
