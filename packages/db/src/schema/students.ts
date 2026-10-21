import { createdAt, id } from "./helpers";
import { tenants } from "./tenants";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// Student credentials are isolated by teacher page. The same email or phone
// can therefore have separate accounts and progress under different tenants.
export const students = sqliteTable(
  "students",
  {
    id: id(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phoneE164: text("phone_e164").notNull(),
    passwordHash: text("password_hash").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: createdAt(),
  },
  (table) => ({
    tenantEmailUnique: uniqueIndex("idx_students_tenant_email").on(table.tenantId, table.email),
    tenantPhoneUnique: uniqueIndex("idx_students_tenant_phone").on(table.tenantId, table.phoneE164),
  }),
);
