import { zValidator } from "@hono/zod-validator";
import { getDb } from "@exam-taker/db";
import { Hono } from "hono";
import { requireRole } from "../../middleware/auth";
import { requireTenant, type TenantEnv } from "../../middleware/tenant-scope";
import { createExamTopicSchema, updateExamTopicSchema } from "@exam-taker/validation/exam-topics";
import * as examTopicsService from "./exam-topics.service";

export const examTopicsRoutes = new Hono<TenantEnv>()
  .post("/", requireRole("teacher"), requireTenant, zValidator("json", createExamTopicSchema), async (c) => {
    const examTopic = await examTopicsService.createExamTopic(getDb(c.env.DB), c.get("tenantId"), c.req.valid("json"));
    return c.json({ examTopic }, 201);
  })
  .patch("/:id", requireRole("teacher"), requireTenant, zValidator("json", updateExamTopicSchema), async (c) => {
    const examTopic = await examTopicsService.updateExamTopic(
      getDb(c.env.DB),
      c.get("tenantId"),
      c.req.param("id"),
      c.req.valid("json"),
    );
    return c.json({ examTopic });
  });
