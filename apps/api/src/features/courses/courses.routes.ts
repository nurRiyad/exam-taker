import { zValidator } from "@hono/zod-validator";
import { getDb } from "@exam-taker/db";
import { Hono } from "hono";
import { z } from "zod";
import { requireAuth, requireRole, type AuthEnv } from "../../middleware/auth";
import { requireTenant, type TenantEnv } from "../../middleware/tenant-scope";
import { updateTenantBrandingSchema } from "@exam-taker/validation/tenants";
import { createCourseSchema, paymentRequestSchema, updateCourseSchema } from "@exam-taker/validation/courses";
import * as coursesService from "./courses.service";
import * as tenantsService from "../tenants/tenants.service";

const paymentRequestStatusQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const courseAccessRoutes = new Hono<AuthEnv>()
  .get("/courses/:id", requireAuth, async (c) => {
    const result = await coursesService.getCourseById(getDb(c.env.DB), c.get("user"), c.req.param("id"));
    return c.json(result);
  })
  .post("/courses/:id/join", requireRole("student"), async (c) => {
    const enrollment = await coursesService.joinCourse(getDb(c.env.DB), c.get("user").id, c.req.param("id"));
    return c.json({ enrollment }, 201);
  })
  .post(
    "/courses/:id/payment-requests",
    requireRole("student"),
    zValidator("json", paymentRequestSchema),
    async (c) => {
      const paymentAccessRequest = await coursesService.createPaymentRequest(
        getDb(c.env.DB),
        c.get("user").id,
        c.req.param("id"),
        c.req.valid("json"),
      );
      return c.json({ paymentAccessRequest }, 201);
    },
  );

export const coursesRoutes = new Hono<TenantEnv>()
  .patch(
    "/teacher/tenant",
    requireRole("teacher"),
    requireTenant,
    zValidator("json", updateTenantBrandingSchema),
    async (c) => {
      const tenant = await tenantsService.updateBranding(getDb(c.env.DB), c.get("tenantId"), c.req.valid("json"));
      return c.json({ tenant });
    },
  )
  .post("/courses", requireRole("teacher"), requireTenant, zValidator("json", createCourseSchema), async (c) => {
    const course = await coursesService.createCourse(getDb(c.env.DB), c.get("tenantId"), c.req.valid("json"));
    return c.json({ course }, 201);
  })
  .patch("/courses/:id", requireRole("teacher"), requireTenant, zValidator("json", updateCourseSchema), async (c) => {
    const course = await coursesService.updateCourse(
      getDb(c.env.DB),
      c.get("tenantId"),
      c.req.param("id"),
      c.req.valid("json"),
    );
    return c.json({ course });
  })
  .post("/courses/:id/publish", requireRole("teacher"), requireTenant, async (c) => {
    const course = await coursesService.publishCourse(getDb(c.env.DB), c.get("tenantId"), c.req.param("id"));
    return c.json({ course });
  })
  .get("/teacher/courses", requireRole("teacher"), requireTenant, async (c) => {
    const courses = await coursesService.listTeacherCourses(getDb(c.env.DB), c.get("tenantId"));
    return c.json({ courses });
  })
  .get(
    "/teacher/courses/:id/payment-requests",
    requireRole("teacher"),
    requireTenant,
    zValidator("query", paymentRequestStatusQuerySchema),
    async (c) => {
      const requests = await coursesService.listPaymentRequests(
        getDb(c.env.DB),
        c.get("tenantId"),
        c.req.param("id"),
        c.req.valid("query").status,
      );
      return c.json({ requests });
    },
  )
  .post("/payment-requests/:id/approve", requireRole("teacher"), requireTenant, async (c) => {
    const result = await coursesService.approvePaymentRequest(
      getDb(c.env.DB),
      c.get("tenantId"),
      c.req.param("id"),
      c.get("user").id,
    );
    return c.json(result);
  })
  .post("/payment-requests/:id/reject", requireRole("teacher"), requireTenant, async (c) => {
    const request = await coursesService.rejectPaymentRequest(
      getDb(c.env.DB),
      c.get("tenantId"),
      c.req.param("id"),
      c.get("user").id,
    );
    return c.json({ request });
  })
  .post("/enrollments/:id/block", requireRole("teacher"), requireTenant, async (c) => {
    const enrollment = await coursesService.blockEnrollment(getDb(c.env.DB), c.get("tenantId"), c.req.param("id"));
    return c.json({ enrollment });
  })
  .post("/enrollments/:id/remove", requireRole("teacher"), requireTenant, async (c) => {
    const enrollment = await coursesService.removeEnrollment(getDb(c.env.DB), c.get("tenantId"), c.req.param("id"));
    return c.json({ enrollment });
  });
