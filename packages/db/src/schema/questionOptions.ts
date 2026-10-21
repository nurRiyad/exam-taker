import { createdAt, id } from "./helpers";
import { questions } from "./questions";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const questionOptions = sqliteTable(
  "question_options",
  {
    id: id(),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id),
    optionText: text("option_text").notNull(),
    sortOrder: integer("sort_order").notNull(),
    isCorrect: integer("is_correct", { mode: "boolean" }).notNull().default(false),
    createdAt: createdAt(),
  },
  (table) => ({
    questionOrderUnique: uniqueIndex("idx_question_options_question_order").on(table.questionId, table.sortOrder),
  }),
);
