import { createdAt, id } from "./helpers";
import { tenants } from "./tenants";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const questions = sqliteTable(
  "questions",
  {
    id: id(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    questionText: text("question_text").notNull(),
    status: text("status").notNull().default("draft"),
    explanation: text("explanation"),
    subject: text("subject"),
    examName: text("exam_name"),
    examYear: integer("exam_year"),
    postName: text("post_name"),
    institution: text("institution"),
    source: text("source"),
    createdAt: createdAt(),
  },
  (table) => ({
    tenantStatusCreated: index("idx_questions_tenant_status_created").on(table.tenantId, table.status, table.createdAt),
  }),
);
