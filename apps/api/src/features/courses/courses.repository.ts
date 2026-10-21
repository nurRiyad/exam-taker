import { and, eq, ne } from "drizzle-orm";
import type { Database } from "@exam-taker/db";
import { batches, batchMemberships, courses } from "@exam-taker/db/schema";

type CourseRow = typeof courses.$inferSelect;
type NewCourse = typeof courses.$inferInsert;

export async function findById(db: Database, id: string): Promise<CourseRow | undefined> {
  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return course;
}

/** Returns the course only if it belongs to `tenantId` — the standard
 * ownership gate for every teacher-facing course mutation. */
export async function findOwnedByTenant(db: Database, tenantId: string, id: string): Promise<CourseRow | undefined> {
  const course = await findById(db, id);
  return course && course.tenantId === tenantId ? course : undefined;
}

export async function findByTenant(db: Database, tenantId: string): Promise<CourseRow[]> {
  return db
    .select()
    .from(courses)
    .where(and(eq(courses.tenantId, tenantId), ne(courses.status, "archived")));
}

export async function insert(db: Database, data: NewCourse): Promise<CourseRow> {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
}

export async function update(db: Database, id: string, data: Partial<NewCourse>): Promise<CourseRow> {
  const [course] = await db.update(courses).set(data).where(eq(courses.id, id)).returning();
  return course;
}

/** Whether any student has joined one of this course's batches. */
export async function hasBatchMemberships(db: Database, courseId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: batchMemberships.id })
    .from(batchMemberships)
    .innerJoin(batches, eq(batchMemberships.batchId, batches.id))
    .where(eq(batches.courseId, courseId))
    .limit(1);
  return !!row;
}
