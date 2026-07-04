import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import * as coursesController from "../controllers/courses.controller";
import { requireAuth, requireRole, type AuthEnv } from "../middleware/auth";
import { requireTenant, type TenantEnv } from "../middleware/tenant-scope";
import { createCourseSchema, paymentRequestSchema, updateCourseSchema } from "../validation/courses";
import { updateTenantBrandingSchema } from "../validation/tenants";

const paymentRequestStatusQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

// Any-authenticated-role course access — student/public-facing, never scoped
// by tenantId. Kept as its own `Hono<AuthEnv>()` (rather than folded into
// `coursesRoutes` below) so these handlers can never be typed with a
// `tenantId` that's not actually set on `c` at runtime.
export const courseAccessRoutes = new Hono<AuthEnv>()
  .get("/courses/:id", requireAuth, (c) => coursesController.getCourse(c, c.req.param("id")))
  .post("/courses/:id/join", requireRole("student"), (c) => coursesController.joinCourse(c, c.req.param("id")))
  .post(
    "/courses/:id/payment-requests",
    requireRole("student"),
    zValidator("json", paymentRequestSchema),
    (c) => coursesController.createPaymentRequest(c, c.req.param("id"), c.req.valid("json")),
  );

// Mounted at "/" in src/index.ts — paths span several prefixes
// (/teacher/tenant, /courses, /enrollments, /payment-requests) that don't
// share a single route-group prefix. Handlers stay inline one-liners
// delegating to the controller — required for Hono RPC type inference; see
// routes/auth.ts. Every route here runs `requireTenant`.
export const coursesRoutes = new Hono<TenantEnv>()
  .patch(
    "/teacher/tenant",
    requireRole("teacher"),
    requireTenant,
    zValidator("json", updateTenantBrandingSchema),
    (c) => coursesController.updateTenantBranding(c, c.req.valid("json")),
  )
  .post("/courses", requireRole("teacher"), requireTenant, zValidator("json", createCourseSchema), (c) =>
    coursesController.createCourse(c, c.req.valid("json")),
  )
  .patch("/courses/:id", requireRole("teacher"), requireTenant, zValidator("json", updateCourseSchema), (c) =>
    coursesController.updateCourse(c, c.req.param("id"), c.req.valid("json")),
  )
  .post("/courses/:id/publish", requireRole("teacher"), requireTenant, (c) =>
    coursesController.publishCourse(c, c.req.param("id")),
  )
  .get("/teacher/courses", requireRole("teacher"), requireTenant, (c) => coursesController.listTeacherCourses(c))
  .get(
    "/teacher/courses/:id/payment-requests",
    requireRole("teacher"),
    requireTenant,
    zValidator("query", paymentRequestStatusQuerySchema),
    (c) => coursesController.listPaymentRequests(c, c.req.param("id"), c.req.valid("query").status),
  )
  .post("/payment-requests/:id/approve", requireRole("teacher"), requireTenant, (c) =>
    coursesController.approvePaymentRequest(c, c.req.param("id")),
  )
  .post("/payment-requests/:id/reject", requireRole("teacher"), requireTenant, (c) =>
    coursesController.rejectPaymentRequest(c, c.req.param("id")),
  )
  .post("/enrollments/:id/block", requireRole("teacher"), requireTenant, (c) =>
    coursesController.blockEnrollment(c, c.req.param("id")),
  )
  .post("/enrollments/:id/remove", requireRole("teacher"), requireTenant, (c) =>
    coursesController.removeEnrollment(c, c.req.param("id")),
  );
