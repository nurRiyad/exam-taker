import { and, eq } from "drizzle-orm";
import type { Database } from "@exam-taker/db";
import { batches, courses, examAttempts, examQuestionLinks, exams } from "@exam-taker/db/schema";

export async function findOwnedBatch(db: Database, tenantId: string, courseId: string, batchId: string) {
  const [batch] = await db
    .select({ id: batches.id, courseId: batches.courseId, tenantId: courses.tenantId })
    .from(batches)
    .innerJoin(courses, eq(batches.courseId, courses.id))
    .where(and(eq(batches.id, batchId), eq(batches.courseId, courseId), eq(courses.tenantId, tenantId)));
  return batch;
}

export function findByBatch(db: Database, batchId: string) {
  return db.select().from(exams).where(eq(exams.batchId, batchId)).orderBy(exams.startsAt);
}

export async function findById(db: Database, batchId: string, examId: string) {
  const [exam] = await db
    .select()
    .from(exams)
    .where(and(eq(exams.id, examId), eq(exams.batchId, batchId)));
  return exam;
}

export async function insert(db: Database, id: string, values: typeof exams.$inferInsert) {
  await db.insert(exams).values(values);
  return findById(db, values.batchId, id);
}

export async function update(
  db: Database,
  batchId: string,
  examId: string,
  values: Partial<typeof exams.$inferInsert>,
) {
  await db
    .update(exams)
    .set(values)
    .where(and(eq(exams.id, examId), eq(exams.batchId, batchId)));
  return findById(db, batchId, examId);
}

export async function remove(db: Database, batchId: string, examId: string) {
  await db.delete(examQuestionLinks).where(eq(examQuestionLinks.examId, examId));
  await db.delete(exams).where(and(eq(exams.id, examId), eq(exams.batchId, batchId)));
}

export async function hasAttempts(db: Database, examId: string) {
  const [attempt] = await db
    .select({ id: examAttempts.id })
    .from(examAttempts)
    .where(eq(examAttempts.examId, examId))
    .limit(1);
  return Boolean(attempt);
}
