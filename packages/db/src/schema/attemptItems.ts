import { id } from "./helpers";
import { examQuestionLinks } from "./examQuestionLinks";
import { examAttempts } from "./examAttempts";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const attemptItems = sqliteTable(
  "attempt_items",
  {
    id: id(),
    attemptId: text("attempt_id")
      .notNull()
      .references(() => examAttempts.id),
    examQuestionLinkId: text("exam_question_link_id")
      .notNull()
      .references(() => examQuestionLinks.id),
    questionTextSnapshot: text("question_text_snapshot").notNull(),
    optionsSnapshot: text("options_snapshot").notNull(),
    correctOptionSnapshot: text("correct_option_snapshot").notNull().$type<"a" | "b" | "c" | "d">(),
    displayOrder: integer("display_order").notNull(),
    optionOrder: text("option_order").notNull(),
    selectedOption: text("selected_option").$type<"a" | "b" | "c" | "d" | null>(),
    isCorrect: integer("is_correct", { mode: "boolean" }),
    markAwarded: real("mark_awarded"),
    answeredAt: text("answered_at"),
  },
  (table) => ({ attempt: index("idx_attempt_items_attempt").on(table.attemptId) }),
);
