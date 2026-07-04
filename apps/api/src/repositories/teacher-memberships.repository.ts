import { eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { teacherMemberships } from "../db/schema";

type TeacherMembershipRow = typeof teacherMemberships.$inferSelect;
type NewTeacherMembership = typeof teacherMemberships.$inferInsert;

/** A user is only ever expected to own one tenant (createTenant rejects a
 * second), but this orders by `createdAt` to stay deterministic (first
 * membership wins) if that invariant is ever violated. */
export async function findByUserId(db: Database, userId: string): Promise<TeacherMembershipRow | undefined> {
  const [membership] = await db
    .select()
    .from(teacherMemberships)
    .where(eq(teacherMemberships.userId, userId))
    .orderBy(teacherMemberships.createdAt)
    .limit(1);
  return membership;
}

export async function insert(db: Database, data: NewTeacherMembership): Promise<TeacherMembershipRow> {
  const [membership] = await db.insert(teacherMemberships).values(data).returning();
  return membership;
}
