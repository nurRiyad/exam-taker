import { createdAt, id } from "./helpers";
import { courses } from "./courses";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const batches = sqliteTable(
  "batches",
  {
    id: id(),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
    status: text("status").notNull().default("upcoming"),
    capacity: integer("capacity"),
    syllabus: text("syllabus"),
    materials: text("materials"),
    firstExamDate: text("first_exam_date"),
    examTime: text("exam_time"),
    examIntervalDays: integer("exam_interval_days"),
    createdAt: createdAt(),
  },
  (table) => ({ course: index("idx_batches_course").on(table.courseId) }),
);
