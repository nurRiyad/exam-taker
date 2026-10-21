import { sql } from "drizzle-orm";
import { id } from "./helpers";
import { users } from "./users";
import { exams } from "./exams";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const examAttempts = sqliteTable(
  "exam_attempts",
  {
    id: id(),
    examId: text("exam_id")
      .notNull()
      .references(() => exams.id),
    studentUserId: text("student_user_id")
      .notNull()
      .references(() => users.id),
    attemptType: text("attempt_type").notNull().$type<"live" | "mock">(),
    attemptNumber: integer("attempt_number").notNull().default(1),
    startedAt: text("started_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    submittedAt: text("submitted_at"),
    autoSubmitted: integer("auto_submitted", { mode: "boolean" }).notNull().default(false),
    durationSeconds: integer("duration_seconds"),
    score: real("score"),
    rank: integer("rank"),
    mockAnalyticsConsent: integer("mock_analytics_consent", { mode: "boolean" }).notNull().default(false),
    status: text("status").notNull().default("in_progress"),
  },
  (table) => ({
    exam: index("idx_attempts_exam").on(table.examId),
    student: index("idx_attempts_student").on(table.studentUserId),
  }),
);
