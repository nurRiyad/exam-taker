import { zValidator } from "@hono/zod-validator";
import { getDb } from "@exam-taker/db";
import { Hono } from "hono";
import { requireAuth, requireRole, type AuthEnv } from "../../middleware/auth";
import { requireTenant, type TenantEnv } from "../../middleware/tenant-scope";
import { updateTenantBrandingSchema } from "@exam-taker/validation/tenants";
import { createCourseSchema, updateCourseSchema } from "@exam-taker/validation/courses";
import * as coursesService from "./courses.service";
import * as tenantsService from "../tenants/tenants.service";

export const courseAccessRoutes = new Hono<AuthEnv>().get("/courses/:id", requireAuth, async (c) => {
  const result = await coursesService.getCourseById(getDb(c.env.DB), c.req.param("id"));
  return c.json(result);
});

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
  .get("/teacher/courses", requireRole("teacher"), requireTenant, async (c) => {
    const courses = await coursesService.listTeacherCourses(getDb(c.env.DB), c.get("tenantId"));
    return c.json({ courses });
  })
  .get("/teacher/courses/:id", requireRole("teacher"), requireTenant, async (c) => {
    const result = await coursesService.getTeacherCourse(getDb(c.env.DB), c.get("tenantId"), c.req.param("id"));
    return c.json(result);
  })
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
  .delete("/courses/:id", requireRole("teacher"), requireTenant, async (c) => {
    const result = await coursesService.archiveCourse(getDb(c.env.DB), c.get("tenantId"), c.req.param("id"));
    return c.json(result);
  })
  .post("/courses/:id/publish", requireRole("teacher"), requireTenant, async (c) => {
    const course = await coursesService.publishCourse(getDb(c.env.DB), c.get("tenantId"), c.req.param("id"));
    return c.json({ course });
  });
