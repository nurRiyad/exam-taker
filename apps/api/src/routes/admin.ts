import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as adminController from "../controllers/admin.controller";
import { requireRole, type AuthEnv } from "../middleware/auth";
import { createTenantSchema } from "../validation/tenants";

// Handlers stay inline one-liners delegating to the controller — required for
// Hono RPC type inference; see routes/auth.ts.
export const adminRoutes = new Hono<AuthEnv>().post(
  "/tenants",
  requireRole("admin"),
  zValidator("json", createTenantSchema),
  (c) => adminController.createTenant(c, c.req.valid("json")),
);
