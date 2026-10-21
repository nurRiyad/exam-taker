import { z } from "zod";

export const examStatusSchema = z.enum(["draft", "published"]);

export const createExamSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().nullable().optional(),
  topicText: z.string().nullable().optional(),
  startsAt: z.string().datetime(),
  durationMinutes: z.number().int().positive(),
  totalMarks: z.number().positive().nullable().optional(),
  markPerCorrect: z.number().positive().default(1),
  negativeMarkingEnabled: z.boolean().default(false),
  negativeMarkPerWrong: z.number().min(0).default(0),
  answerChangeAllowed: z.boolean().default(true),
  autosaveEnabled: z.boolean().default(true),
  mockEnabled: z.boolean().default(false),
  mockRetryLimit: z.number().int().positive().nullable().optional(),
  resultReleaseMode: z.enum(["automatic", "manual", "scheduled"]).default("automatic"),
  resultReleaseAt: z.string().nullable().optional(),
  status: examStatusSchema.default("draft"),
});

export type CreateExamInput = z.infer<typeof createExamSchema>;
export const updateExamSchema = createExamSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update",
});
export type UpdateExamInput = z.infer<typeof updateExamSchema>;
