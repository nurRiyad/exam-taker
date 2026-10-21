import { createdAt, id } from "./helpers";
import { users } from "./users";
import { students } from "./students";
import { batches } from "./batches";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const batchAccessRequests = sqliteTable(
  "batch_access_requests",
  {
    id: id(),
    batchId: text("batch_id")
      .notNull()
      .references(() => batches.id),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id),
    transactionId: text("transaction_id").notNull(),
    status: text("status").notNull().default("pending"),
    reviewedByUserId: text("reviewed_by_user_id").references(() => users.id),
    reviewedAt: text("reviewed_at"),
    createdAt: createdAt(),
  },
  (table) => ({ batchStatus: index("idx_batch_access_requests_batch_status").on(table.batchId, table.status) }),
);

// Platform-to-teacher billing. Unrelated to courses.basePriceBdt,
// which is the student-facing price.
