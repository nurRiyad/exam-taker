import { eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { courseEnrollments, courses } from "../db/schema";

type CourseRow = typeof courses.$inferSelect;
type NewCourse = typeof courses.$inferInsert;

export async function findById(db: Database, id: string): Promise<CourseRow | undefined> {
  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return course;
}

/** Returns the course only if it belongs to `tenantId` — the standard
 * ownership gate for every teacher-facing course mutation (ADR-0052). */
export async function findOwnedByTenant(db: Database, tenantId: string, id: string): Promise<CourseRow | undefined> {
  const course = await findById(db, id);
  return course && course.tenantId === tenantId ? course : undefined;
}

export async function findByTenant(db: Database, tenantId: string): Promise<CourseRow[]> {
  return db.select().from(courses).where(eq(courses.tenantId, tenantId));
}

export async function insert(db: Database, data: NewCourse): Promise<CourseRow> {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
}

export async function update(db: Database, id: string, data: Partial<NewCourse>): Promise<CourseRow> {
  const [course] = await db.update(courses).set(data).where(eq(courses.id, id)).returning();
  return course;
}

/** Whether any student has ever enrolled — gates `base_price_bdt` immutability. */
export async function hasEnrollments(db: Database, courseId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: courseEnrollments.id })
    .from(courseEnrollments)
    .where(eq(courseEnrollments.courseId, courseId))
    .limit(1);
  return !!row;
}
