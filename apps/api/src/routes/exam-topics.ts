import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as examTopicsController from "../controllers/exam-topics.controller";
import { requireRole } from "../middleware/auth";
import { requireTenant, type TenantEnv } from "../middleware/tenant-scope";
import { createExamTopicSchema, updateExamTopicSchema } from "../validation/exam-topics";

// Handlers stay inline one-liners delegating to the controller — required for
// Hono RPC type inference; see routes/auth.ts.
export const examTopicsRoutes = new Hono<TenantEnv>()
  .post("/", requireRole("teacher"), requireTenant, zValidator("json", createExamTopicSchema), (c) =>
    examTopicsController.createExamTopic(c, c.req.valid("json")),
  )
  .patch("/:id", requireRole("teacher"), requireTenant, zValidator("json", updateExamTopicSchema), (c) =>
    examTopicsController.updateExamTopic(c, c.req.param("id"), c.req.valid("json")),
  );
