import { and, eq, or } from "drizzle-orm";
import type { Database } from "@exam-taker/db";
import { students } from "@exam-taker/db/schema";

export type StudentRow = typeof students.$inferSelect;

export async function findByTenantAndIdentifier(
  db: Database,
  tenantId: string,
  identifier: string,
  phoneE164?: string,
) {
  const [student] = await db
    .select()
    .from(students)
    .where(
      and(
        eq(students.tenantId, tenantId),
        or(
          eq(students.email, identifier.trim().toLowerCase()),
          eq(students.phoneE164, identifier),
          phoneE164 ? eq(students.phoneE164, phoneE164) : undefined,
        ),
      ),
    )
    .limit(1);
  return student;
}

export async function findConflicts(db: Database, tenantId: string, email: string, phoneE164: string) {
  return db
    .select({ email: students.email, phoneE164: students.phoneE164 })
    .from(students)
    .where(and(eq(students.tenantId, tenantId), or(eq(students.email, email), eq(students.phoneE164, phoneE164))));
}

export async function findById(db: Database, id: string) {
  const [student] = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return student;
}

export async function insert(db: Database, data: typeof students.$inferInsert) {
  const [student] = await db.insert(students).values(data).returning();
  return student;
}
