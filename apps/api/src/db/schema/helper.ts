
import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

export const id = () =>
  text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`);

export const createdAt = () =>
  text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`);