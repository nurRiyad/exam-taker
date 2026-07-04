import { eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { tenants } from "../db/schema";

type TenantRow = typeof tenants.$inferSelect;
type NewTenant = typeof tenants.$inferInsert;

export async function findById(db: Database, id: string): Promise<TenantRow | undefined> {
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
  return tenant;
}

export async function findBySlug(db: Database, slug: string): Promise<Pick<TenantRow, "id"> | undefined> {
  const [existing] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, slug)).limit(1);
  return existing;
}

export async function insert(db: Database, data: NewTenant): Promise<TenantRow> {
  const [tenant] = await db.insert(tenants).values(data).returning();
  return tenant;
}

export async function update(db: Database, id: string, data: Partial<NewTenant>): Promise<TenantRow> {
  const [tenant] = await db.update(tenants).set(data).where(eq(tenants.id, id)).returning();
  return tenant;
}
