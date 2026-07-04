// First tenant-scoping middleware (ADR-0052): every teacher-owned resource
// (courses, exam topics, enrollments, payment requests) must be scoped to the
// caller's own tenant, never a client-supplied id. Must run after
// `requireRole("teacher")` so `c.get("user")` is already populated.
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { getDb } from "../db/client";
import * as teacherMembershipsRepository from "../repositories/teacher-memberships.repository";
import type { AuthEnv } from "./auth";

export type TenantEnv = AuthEnv & {
  Variables: AuthEnv["Variables"] & { tenantId: string };
};

export const requireTenant = createMiddleware<TenantEnv>(async (c, next) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const membership = await teacherMembershipsRepository.findByUserId(db, user.id);
  if (!membership) throw new HTTPException(403, { message: "No tenant membership" });
  c.set("tenantId", membership.tenantId);
  await next();
});
