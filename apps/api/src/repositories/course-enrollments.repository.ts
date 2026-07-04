import { and, eq, ne } from "drizzle-orm";
import type { Database } from "../db/client";
import { courseEnrollments, courses } from "../db/schema";

type EnrollmentRow = typeof courseEnrollments.$inferSelect;
type NewEnrollment = typeof courseEnrollments.$inferInsert;

export async function findById(db: Database, id: string): Promise<EnrollmentRow | undefined> {
  const [row] = await db.select().from(courseEnrollments).where(eq(courseEnrollments.id, id)).limit(1);
  return row;
}

export async function findByCourseAndStudent(
  db: Database,
  courseId: string,
  studentUserId: string,
): Promise<EnrollmentRow | undefined> {
  const [row] = await db
    .select()
    .from(courseEnrollments)
    .where(and(eq(courseEnrollments.courseId, courseId), eq(courseEnrollments.studentUserId, studentUserId)))
    .limit(1);
  return row;
}

export async function insert(db: Database, data: NewEnrollment): Promise<EnrollmentRow> {
  const [row] = await db.insert(courseEnrollments).values(data).returning();
  return row;
}

export async function update(db: Database, id: string, data: Partial<NewEnrollment>): Promise<EnrollmentRow> {
  const [row] = await db.update(courseEnrollments).set(data).where(eq(courseEnrollments.id, id)).returning();
  return row;
}

/** Non-async: returns the unexecuted query so callers can compose it into a
 * `db.batch([...])` alongside another table's statement (see
 * `services/courses.service.ts`'s `approvePaymentRequest`). */
export function updateQuery(db: Database, id: string, data: Partial<NewEnrollment>) {
  return db.update(courseEnrollments).set(data).where(eq(courseEnrollments.id, id)).returning();
}

/** Any non-removed enrollment tying a student to one of a tenant's courses —
 * used to tighten Step 3's reset-code endpoint to students the calling
 * teacher actually has a relationship with (ADR-0025). `removed` is excluded
 * since that state means the relationship has ended; `blocked` still counts
 * since the student remains enrolled, just access-restricted. */
export async function existsForTenantAndStudent(
  db: Database,
  tenantId: string,
  studentUserId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ id: courseEnrollments.id })
    .from(courseEnrollments)
    .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
    .where(
      and(
        eq(courses.tenantId, tenantId),
        eq(courseEnrollments.studentUserId, studentUserId),
        ne(courseEnrollments.accessStatus, "removed"),
      ),
    )
    .limit(1);
  return !!row;
}
