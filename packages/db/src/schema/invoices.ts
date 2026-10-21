import { createdAt, id } from "./helpers";
import { tenants } from "./tenants";
import { users } from "./users";
import { courses } from "./courses";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const invoices = sqliteTable("invoices", {
  id: id(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  studentCountSnapshot: integer("student_count_snapshot").notNull(),
  rateSnapshotBdt: real("rate_snapshot_bdt").notNull(),
  amountBdt: real("amount_bdt").notNull(),
  manualAdjustmentBdt: real("manual_adjustment_bdt").notNull().default(0),
  status: text("status").notNull().default("draft"),
  generatedByUserId: text("generated_by_user_id")
    .notNull()
    .references(() => users.id),
  sentAt: text("sent_at"),
  paidAt: text("paid_at"),
  createdAt: createdAt(),
});

// Locked entirely at publish — enforced in application code, not by
// a DB trigger, to keep the MVP migration simple.
