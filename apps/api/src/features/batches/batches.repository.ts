import { and, eq } from "drizzle-orm";
import type { Database } from "@exam-taker/db";
import { batches, courses } from "@exam-taker/db/schema";

export async function findOwnedCourse(db: Database, tenantId: string, courseId: string) {
  const [course] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(and(eq(courses.id, courseId), eq(courses.tenantId, tenantId)));
  return course;
}

export async function findById(db: Database, courseId: string, batchId: string) {
  const [batch] = await db
    .select()
    .from(batches)
    .where(and(eq(batches.id, batchId), eq(batches.courseId, courseId)));
  return batch;
}

export function findByCourse(db: Database, courseId: string) {
  return db.select().from(batches).where(eq(batches.courseId, courseId));
}

export async function insert(db: Database, id: string, values: typeof batches.$inferInsert) {
  await db.insert(batches).values(values);
  return findById(db, values.courseId, id);
}

export async function update(
  db: Database,
  courseId: string,
  batchId: string,
  values: Partial<typeof batches.$inferInsert>,
) {
  await db
    .update(batches)
    .set(values)
    .where(and(eq(batches.id, batchId), eq(batches.courseId, courseId)));
  return findById(db, courseId, batchId);
}

export async function remove(db: Database, courseId: string, batchId: string) {
  await db.delete(batches).where(and(eq(batches.id, batchId), eq(batches.courseId, courseId)));
}
