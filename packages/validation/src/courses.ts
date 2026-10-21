import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullSyllabus: z.string().min(1, "Full syllabus is required"),
  basePriceBdt: z.number().min(0),
  isFree: z.boolean(),
  status: z.enum(["draft", "published"]).default("draft"),
  discountPercent: z.number().min(0).max(100).optional(),
  discountStartAt: z.coerce.date().optional(),
  discountEndAt: z.coerce.date().optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

// Price immutability and publish readiness are enforced in the service layer.
export const updateCourseSchema = createCourseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: "Provide at least one field to update" });

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

export const paymentRequestSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
});

export type PaymentRequestInput = z.infer<typeof paymentRequestSchema>;
