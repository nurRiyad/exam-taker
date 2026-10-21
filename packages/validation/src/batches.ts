import { z } from "zod";

export const batchStatusSchema = z.enum(["upcoming", "active", "completed"]);

export const createBatchSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  status: batchStatusSchema.default("upcoming"),
  capacity: z.number().int().positive().nullable().optional(),
  syllabus: z.string().nullable().optional(),
  materials: z.string().nullable().optional(),
  firstExamDate: z.string().nullable().optional(),
  examTime: z.string().nullable().optional(),
  examIntervalDays: z.number().int().min(1).max(90).nullable().optional(),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;

export const updateBatchSchema = createBatchSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update",
});

export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;
