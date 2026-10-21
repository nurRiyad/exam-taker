import { createdAt, id } from "./helpers";
import { users } from "./users";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const resetCodes = sqliteTable(
  "reset_codes",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    codeHash: text("code_hash").notNull(),
    generatedByUserId: text("generated_by_user_id")
      .notNull()
      .references(() => users.id),
    expiresAt: text("expires_at").notNull(),
    usedAt: text("used_at"),
    createdAt: createdAt(),
  },
  (table) => ({ user: index("idx_reset_codes_user").on(table.userId) }),
);
