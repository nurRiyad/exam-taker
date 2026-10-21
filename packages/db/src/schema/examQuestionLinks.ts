import { createdAt, id } from "./helpers";
import { exams } from "./exams";
import { questions } from "./questions";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const examQuestionLinks = sqliteTable(
  "exam_question_links",
  {
    id: id(),
    examId: text("exam_id")
      .notNull()
      .references(() => exams.id),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAt(),
  },
  (table) => ({
    examQuestionUnique: uniqueIndex("idx_exam_question_links_exam_question").on(table.examId, table.questionId),
    examOrderUnique: uniqueIndex("idx_exam_question_links_exam_order").on(table.examId, table.sortOrder),
  }),
);
