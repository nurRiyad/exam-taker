import { zValidator } from "@hono/zod-validator";
import { getDb } from "@exam-taker/db";
import { createExamSchema, updateExamSchema } from "@exam-taker/validation/exams";
import { Hono } from "hono";
import { requireRole } from "../../middleware/auth";
import { requireTenant, type TenantEnv } from "../../middleware/tenant-scope";
import * as examsService from "./exams.service";

export const examsRoutes = new Hono<TenantEnv>()
  .get("/teacher/courses/:courseId/batches/:batchId/exams", requireRole("teacher"), requireTenant, async (c) => {
    return c.json(
      await examsService.listExams(getDb(c.env.DB), c.get("tenantId"), c.req.param("courseId"), c.req.param("batchId")),
    );
  })
  .get(
    "/teacher/courses/:courseId/batches/:batchId/exams/:examId",
    requireRole("teacher"),
    requireTenant,
    async (c) => {
      return c.json(
        await examsService.getExam(
          getDb(c.env.DB),
          c.get("tenantId"),
          c.req.param("courseId"),
          c.req.param("batchId"),
          c.req.param("examId"),
        ),
      );
    },
  )
  .post(
    "/teacher/courses/:courseId/batches/:batchId/exams",
    requireRole("teacher"),
    requireTenant,
    zValidator("json", createExamSchema),
    async (c) => {
      const result = await examsService.createExam(
        getDb(c.env.DB),
        c.get("tenantId"),
        c.req.param("courseId"),
        c.req.param("batchId"),
        c.req.valid("json"),
      );
      return c.json(result, 201);
    },
  )
  .patch(
    "/teacher/courses/:courseId/batches/:batchId/exams/:examId",
    requireRole("teacher"),
    requireTenant,
    zValidator("json", updateExamSchema),
    async (c) => {
      return c.json(
        await examsService.updateExam(
          getDb(c.env.DB),
          c.get("tenantId"),
          c.req.param("courseId"),
          c.req.param("batchId"),
          c.req.param("examId"),
          c.req.valid("json"),
        ),
      );
    },
  )
  .delete(
    "/teacher/courses/:courseId/batches/:batchId/exams/:examId",
    requireRole("teacher"),
    requireTenant,
    async (c) => {
      return c.json(
        await examsService.deleteExam(
          getDb(c.env.DB),
          c.get("tenantId"),
          c.req.param("courseId"),
          c.req.param("batchId"),
          c.req.param("examId"),
        ),
      );
    },
  );
