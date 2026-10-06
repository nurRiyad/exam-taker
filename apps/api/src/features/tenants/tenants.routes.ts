import { zValidator } from "@hono/zod-validator";
import { getDb } from "@exam-taker/db";
import { Hono } from "hono";
import { requireRole, type AuthEnv } from "../../middleware/auth";
import { createTenantSchema } from "@exam-taker/validation/tenants";
import * as tenantsService from "./tenants.service";

export const tenantRoutes = new Hono<AuthEnv>().post(
  "/tenants",
  requireRole("admin"),
  zValidator("json", createTenantSchema),
  async (c) => {
    const tenant = await tenantsService.createTenant(getDb(c.env.DB), c.req.valid("json"));
    return c.json({ tenant }, 201);
  },
);
