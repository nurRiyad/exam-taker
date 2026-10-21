import { zValidator } from "@hono/zod-validator";
import { getDb } from "@exam-taker/db";
import { createBatchSchema, updateBatchSchema } from "@exam-taker/validation/batches";
import { Hono } from "hono";
import { requireRole } from "../../middleware/auth";
import { requireTenant, type TenantEnv } from "../../middleware/tenant-scope";
import * as batchesService from "./batches.service";

export const batchesRoutes = new Hono<TenantEnv>()
  .get("/teacher/courses/:courseId/batches", requireRole("teacher"), requireTenant, async (c) => {
    return c.json(await batchesService.listCourseBatches(getDb(c.env.DB), c.get("tenantId"), c.req.param("courseId")));
  })
  .get("/teacher/courses/:courseId/batches/:batchId", requireRole("teacher"), requireTenant, async (c) => {
    return c.json(
      await batchesService.getBatch(
        getDb(c.env.DB),
        c.get("tenantId"),
        c.req.param("courseId"),
        c.req.param("batchId"),
      ),
    );
  })
  .post(
    "/teacher/courses/:courseId/batches",
    requireRole("teacher"),
    requireTenant,
    zValidator("json", createBatchSchema),
    async (c) => {
      const result = await batchesService.createBatch(
        getDb(c.env.DB),
        c.get("tenantId"),
        c.req.param("courseId"),
        c.req.valid("json"),
      );
      return c.json(result, 201);
    },
  )
  .patch(
    "/teacher/courses/:courseId/batches/:batchId",
    requireRole("teacher"),
    requireTenant,
    zValidator("json", updateBatchSchema),
    async (c) => {
      return c.json(
        await batchesService.updateBatch(
          getDb(c.env.DB),
          c.get("tenantId"),
          c.req.param("courseId"),
          c.req.param("batchId"),
          c.req.valid("json"),
        ),
      );
    },
  )
  .delete("/teacher/courses/:courseId/batches/:batchId", requireRole("teacher"), requireTenant, async (c) => {
    return c.json(
      await batchesService.deleteBatch(
        getDb(c.env.DB),
        c.get("tenantId"),
        c.req.param("courseId"),
        c.req.param("batchId"),
      ),
    );
  });
