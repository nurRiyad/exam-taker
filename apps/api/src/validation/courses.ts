import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullSyllabus: z.string().min(1, "Full syllabus is required"),
  basePriceBdt: z.number().min(0),
  isFree: z.boolean(),
  discountPercent: z.number().min(0).max(100).optional(),
  discountStartAt: z.coerce.date().optional(),
  discountEndAt: z.coerce.date().optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

// basePriceBdt's own immutability-once-enrolled rule is enforced in the
// service layer (needs a DB lookup), not here — `status` is deliberately
// excluded so the draft -> published transition only ever happens through
// the dedicated `/courses/:id/publish` validation gate (ADR-0058).
export const updateCourseSchema = createCourseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: "Provide at least one field to update" });

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

export const paymentRequestSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
});

export type PaymentRequestInput = z.infer<typeof paymentRequestSchema>;
