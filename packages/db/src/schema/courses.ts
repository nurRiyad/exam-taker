import { createdAt, id } from "./helpers";
import { tenants } from "./tenants";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const courses = sqliteTable(
  "courses",
  {
    id: id(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    title: text("title").notNull(),
    shortDescription: text("short_description"),
    fullSyllabus: text("full_syllabus"),
    basePriceBdt: real("base_price_bdt").notNull().default(0),
    isFree: integer("is_free", { mode: "boolean" }).notNull().default(false),
    discountPercent: real("discount_percent"),
    discountStartAt: text("discount_start_at"),
    discountEndAt: text("discount_end_at"),
    status: text("status").notNull().default("draft"),
    createdAt: createdAt(),
  },
  (table) => ({ tenant: index("idx_courses_tenant").on(table.tenantId) }),
);
