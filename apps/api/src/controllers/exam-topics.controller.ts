// HTTP-facing orchestration — see controllers/auth.controller.ts.
import type { Context } from "hono";
import { getDb } from "../db/client";
import type { TenantEnv } from "../middleware/tenant-scope";
import * as examTopicsService from "../services/exam-topics.service";
import type { CreateExamTopicInput, UpdateExamTopicInput } from "../validation/exam-topics";

export async function createExamTopic(c: Context<TenantEnv>, input: CreateExamTopicInput) {
  const db = getDb(c.env.DB);
  const examTopic = await examTopicsService.createExamTopic(db, c.get("tenantId"), input);
  return c.json({ examTopic }, 201);
}

export async function updateExamTopic(c: Context<TenantEnv>, examTopicId: string, input: UpdateExamTopicInput) {
  const db = getDb(c.env.DB);
  const examTopic = await examTopicsService.updateExamTopic(db, c.get("tenantId"), examTopicId, input);
  return c.json({ examTopic });
}
