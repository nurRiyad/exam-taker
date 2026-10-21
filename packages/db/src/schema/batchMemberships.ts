import { createdAt, id } from "./helpers";
import { students } from "./students";
import { batches } from "./batches";
import { index, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const batchMemberships = sqliteTable(
  "batch_memberships",
  {
    id: id(),
    batchId: text("batch_id")
      .notNull()
      .references(() => batches.id),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id),
    priceSnapshotBdt: real("price_snapshot_bdt").notNull(),
    accessStatus: text("access_status").notNull().default("joined_pending_payment"),
    blockedAt: text("blocked_at"),
    createdAt: createdAt(),
  },
  (table) => ({
    studentBatchUnique: uniqueIndex("idx_batch_memberships_student_batch").on(table.studentId, table.batchId),
    batchStatus: index("idx_batch_memberships_batch_status").on(table.batchId, table.accessStatus),
  }),
);
