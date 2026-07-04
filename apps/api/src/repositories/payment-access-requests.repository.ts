import { and, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { paymentAccessRequests } from "../db/schema";

type PaymentRequestRow = typeof paymentAccessRequests.$inferSelect;
type NewPaymentRequest = typeof paymentAccessRequests.$inferInsert;

export async function findById(db: Database, id: string): Promise<PaymentRequestRow | undefined> {
  const [row] = await db.select().from(paymentAccessRequests).where(eq(paymentAccessRequests.id, id)).limit(1);
  return row;
}

export async function findByCourse(
  db: Database,
  courseId: string,
  status?: PaymentRequestRow["status"],
): Promise<PaymentRequestRow[]> {
  const conditions = status
    ? and(eq(paymentAccessRequests.courseId, courseId), eq(paymentAccessRequests.status, status))
    : eq(paymentAccessRequests.courseId, courseId);
  return db.select().from(paymentAccessRequests).where(conditions);
}

export async function insert(db: Database, data: NewPaymentRequest): Promise<PaymentRequestRow> {
  const [row] = await db.insert(paymentAccessRequests).values(data).returning();
  return row;
}

export async function update(
  db: Database,
  id: string,
  data: Partial<NewPaymentRequest>,
): Promise<PaymentRequestRow> {
  const [row] = await db.update(paymentAccessRequests).set(data).where(eq(paymentAccessRequests.id, id)).returning();
  return row;
}

/** Non-async: returns the unexecuted query so callers can compose it into a
 * `db.batch([...])` alongside another table's statement (see
 * `services/courses.service.ts`'s `approvePaymentRequest`). */
export function updateQuery(db: Database, id: string, data: Partial<NewPaymentRequest>) {
  return db.update(paymentAccessRequests).set(data).where(eq(paymentAccessRequests.id, id)).returning();
}
