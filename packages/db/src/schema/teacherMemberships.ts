import { createdAt, id } from "./helpers";
import { tenants } from "./tenants";
import { users } from "./users";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const teacherMemberships = sqliteTable(
  "teacher_memberships",
  {
    id: id(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull().default("owner"),
    createdAt: createdAt(),
  },
  (table) => ({
    teacherUserUnique: uniqueIndex("idx_teacher_memberships_user_unique").on(table.userId),
  }),
);
