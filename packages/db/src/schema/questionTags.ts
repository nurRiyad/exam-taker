import { id } from "./helpers";
import { questions } from "./questions";
import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const questionTags = sqliteTable(
  "question_tags",
  {
    id: id(),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id),
    tag: text("tag").notNull(),
  },
  (table) => ({
    questionTagUnique: uniqueIndex("idx_question_tags_question_tag").on(table.questionId, table.tag),
    tagQuestion: index("idx_question_tags_tag_question").on(table.tag, table.questionId),
  }),
);

// DB also enforces one live attempt per student per exam via a partial unique
// index (exam_id, student_user_id) WHERE attempt_type = 'live' — not
// representable as a plain column constraint here; see 0001_init.sql.
