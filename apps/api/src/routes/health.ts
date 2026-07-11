import { Hono } from "hono";
import { getDb } from "../db/client";
import { tenants } from "../db/schema";

export const healthRoutes = new Hono<{ Bindings: Env }>().get("/health", async (c) => {
	const db = getDb(c.env.DB);
	// Trivial real query, not just a ping — confirms the D1 binding and the
	// Drizzle schema actually agree with each other, not just that the Worker boots.
	const sample = await db.select().from(tenants).limit(1);
	return c.json({ status: "ok", tenantSample: sample });
});
