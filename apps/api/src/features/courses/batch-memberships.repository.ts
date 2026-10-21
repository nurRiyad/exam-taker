import { and, eq, ne } from "drizzle-orm";
import type { Database } from "@exam-taker/db";
import { batches, batchMemberships, courses } from "@exam-taker/db/schema";

/** Whether this student has a non-removed membership in a batch owned by a tenant. */
export async function existsForTenantAndStudent(db: Database, tenantId: string, studentId: string) {
  const [row] = await db
    .select({ id: batchMemberships.id })
    .from(batchMemberships)
    .innerJoin(batches, eq(batchMemberships.batchId, batches.id))
    .innerJoin(courses, eq(batches.courseId, courses.id))
    .where(
      and(
        eq(courses.tenantId, tenantId),
        eq(batchMemberships.studentId, studentId),
        ne(batchMemberships.accessStatus, "removed"),
      ),
    )
    .limit(1);
  return !!row;
}
