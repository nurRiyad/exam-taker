import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id } from "./helper";



export const users = sqliteTable("users", {
  id: id(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  phoneE164: text("phone_e164").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().$type<"student" | "teacher" | "admin">(),
  city: text("city"),
  institution: text("institution"),
  status: text("status").notNull().default("active"),
  createdAt: createdAt(),
});