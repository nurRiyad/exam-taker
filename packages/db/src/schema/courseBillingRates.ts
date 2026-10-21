import { createdAt, id } from "./helpers";
import { users } from "./users";
import { courses } from "./courses";
import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const courseBillingRates = sqliteTable("course_billing_rates", {
  id: id(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  pricePerStudentBdt: real("price_per_student_bdt").notNull(),
  setByUserId: text("set_by_user_id")
    .notNull()
    .references(() => users.id),
  createdAt: createdAt(),
});
