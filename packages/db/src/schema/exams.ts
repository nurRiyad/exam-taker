import { createdAt, id } from "./helpers";
import { tenants } from "./tenants";
import { courses } from "./courses";
import { batches } from "./batches";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const exams = sqliteTable(
  "exams",
  {
    id: id(),
    batchId: text("batch_id")
      .notNull()
      .references(() => batches.id),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id),
    title: text("title").notNull(),
    description: text("description"),
    topicText: text("topic_text"),
    startsAt: text("starts_at").notNull(),
    endsAt: text("ends_at").notNull(),
    durationMinutes: integer("duration_minutes").notNull().default(50),
    totalMarks: real("total_marks"),
    markPerCorrect: real("mark_per_correct").notNull().default(1),
    negativeMarkingEnabled: integer("negative_marking_enabled", { mode: "boolean" }).notNull().default(false),
    negativeMarkPerWrong: real("negative_mark_per_wrong").notNull().default(0),
    answerChangeAllowed: integer("answer_change_allowed", { mode: "boolean" }).notNull().default(true),
    autosaveEnabled: integer("autosave_enabled", { mode: "boolean" }).notNull().default(true),
    mockEnabled: integer("mock_enabled", { mode: "boolean" }).notNull().default(false),
    mockRetryLimit: integer("mock_retry_limit"),
    resultReleaseMode: text("result_release_mode").notNull().default("automatic"),
    resultReleaseAt: text("result_release_at"),
    status: text("status").notNull().default("draft"),
    publishedAt: text("published_at"),
    createdAt: createdAt(),
  },
  (table) => ({
    batchSchedule: index("idx_exams_batch_schedule").on(table.batchId, table.startsAt),
    tenant: index("idx_exams_tenant").on(table.tenantId),
    course: index("idx_exams_course").on(table.courseId),
  }),
);
