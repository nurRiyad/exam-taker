// HTTP-facing orchestration — see controllers/auth.controller.ts.
import type { Context } from "hono";
import { getDb } from "../db/client";
import type { AuthEnv } from "../middleware/auth";
import * as tenantsService from "../services/tenants.service";
import type { CreateTenantInput } from "../validation/tenants";

export async function createTenant(c: Context<AuthEnv>, input: CreateTenantInput) {
  const db = getDb(c.env.DB);
  const tenant = await tenantsService.createTenant(db, input);
  return c.json({ tenant }, 201);
}
