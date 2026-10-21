import { createdAt, id } from "./helpers";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tenants = sqliteTable("tenants", {
  id: id(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  brandColor: text("brand_color"),
  teacherPictureUrl: text("teacher_picture_url"),
  specialty: text("specialty"),
  biography: text("biography"),
  teachingSubjects: text("teaching_subjects"),
  institution: text("institution"),
  division: text("division"),
  district: text("district"),
  status: text("status").notNull().default("active"),
  createdAt: createdAt(),
});
