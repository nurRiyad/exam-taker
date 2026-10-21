import { sql } from "drizzle-orm";
import { id } from "./helpers";
import { tenants } from "./tenants";
import { users } from "./users";
import { courses } from "./courses";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const weakZoneSnapshots = sqliteTable(
  "weak_zone_snapshots",
  {
    id: id(),
    studentUserId: text("student_user_id")
      .notNull()
      .references(() => users.id),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id),
    subject: text("subject"),
    tag: text("tag"),
    attemptsCount: integer("attempts_count").notNull().default(0),
    questionsCount: integer("questions_count").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    accuracyPercent: real("accuracy_percent"),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => ({ student: index("idx_weak_zone_student").on(table.studentUserId) }),
);
