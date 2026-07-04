import { and, desc, eq, gt, isNull } from "drizzle-orm";
import type { Database } from "../db/client";
import { resetCodes } from "../db/schema";

type ResetCodeRow = typeof resetCodes.$inferSelect;
type NewResetCode = typeof resetCodes.$inferInsert;

/** Every unused, unexpired code for a user, newest first — a teacher/admin
 * generating a second code (e.g. after a failed delivery) must not invalidate
 * an earlier still-valid one, so callers check every candidate, not just the
 * most recent. */
export async function findValidCandidates(db: Database, userId: string, now: string): Promise<ResetCodeRow[]> {
  return db
    .select()
    .from(resetCodes)
    .where(and(eq(resetCodes.userId, userId), isNull(resetCodes.usedAt), gt(resetCodes.expiresAt, now)))
    .orderBy(desc(resetCodes.createdAt));
}

export async function insert(db: Database, data: NewResetCode): Promise<ResetCodeRow> {
  const [row] = await db.insert(resetCodes).values(data).returning();
  return row;
}

/** Non-async: returns the unexecuted query so callers can compose it into a
 * `db.batch([...])` alongside another table's statement (see
 * `services/auth.service.ts`'s `redeemResetCode`). */
export function markUsedQuery(db: Database, id: string, usedAt: string) {
  return db.update(resetCodes).set({ usedAt }).where(eq(resetCodes.id, id));
}
