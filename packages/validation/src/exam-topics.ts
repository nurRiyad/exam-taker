import { z } from "zod";

export const createExamTopicSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().optional(),
  scheduledAt: z.coerce.date().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateExamTopicInput = z.infer<typeof createExamTopicSchema>;

export const updateExamTopicSchema = z
  .object({
    title: z.string().min(1).optional(),
    shortDescription: z.string().optional(),
    scheduledAt: z.coerce.date().optional(),
    sortOrder: z.number().int().min(0).optional(),
    status: z.enum(["draft", "published"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Provide at least one field to update" });

export type UpdateExamTopicInput = z.infer<typeof updateExamTopicSchema>;
