// Drizzle mirror of apps/api/migrations/0001_init.sql (source of truth: docs/data-model.md).
//
// Scope note: this file mirrors table/column shape (names, types, nullability,
// defaults, foreign keys) so Drizzle's query builder and TypeScript types match
// the real applied schema. It does NOT re-encode every CHECK constraint or the
// partial unique index on exam_attempts (one-live-attempt-per-student) — those
// are enforced by the migration SQL itself and documented in
// .claude/skills/d1-schema/SKILL.md. Application code must not rely on this
// file alone for those invariants.
import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = () =>
  text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`);

const createdAt = () =>
  text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`);

export const tenants = sqliteTable("tenants", {
  id: id(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  brandColor: text("brand_color"),
  teacherPictureUrl: text("teacher_picture_url"),
  status: text("status").notNull().default("active"),
  createdAt: createdAt(),
});

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

export const teacherMemberships = sqliteTable("teacher_memberships", {
  id: id(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull().default("owner"),
  createdAt: createdAt(),
});

export const courses = sqliteTable("courses", {
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
});

export const courseEnrollments = sqliteTable("course_enrollments", {
  id: id(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  studentUserId: text("student_user_id")
    .notNull()
    .references(() => users.id),
  priceSnapshotBdt: real("price_snapshot_bdt").notNull(),
  accessStatus: text("access_status").notNull().default("joined_pending_payment"),
  blockedAt: text("blocked_at"),
  createdAt: createdAt(),
});

export const paymentAccessRequests = sqliteTable("payment_access_requests", {
  id: id(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  studentUserId: text("student_user_id")
    .notNull()
    .references(() => users.id),
  transactionId: text("transaction_id").notNull(),
  status: text("status").notNull().default("pending"),
  reviewedByUserId: text("reviewed_by_user_id").references(() => users.id),
  reviewedAt: text("reviewed_at"),
  createdAt: createdAt(),
});

// Platform-to-teacher billing (ADR-0053). Unrelated to courses.basePriceBdt,
// which is the student-facing price.
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

export const invoices = sqliteTable("invoices", {
  id: id(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  studentCountSnapshot: integer("student_count_snapshot").notNull(),
  rateSnapshotBdt: real("rate_snapshot_bdt").notNull(),
  amountBdt: real("amount_bdt").notNull(),
  manualAdjustmentBdt: real("manual_adjustment_bdt").notNull().default(0),
  status: text("status").notNull().default("draft"),
  generatedByUserId: text("generated_by_user_id")
    .notNull()
    .references(() => users.id),
  sentAt: text("sent_at"),
  paidAt: text("paid_at"),
  createdAt: createdAt(),
});

export const examTopics = sqliteTable("exam_topics", {
  id: id(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  title: text("title").notNull(),
  shortDescription: text("short_description"),
  scheduledAt: text("scheduled_at"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status").notNull().default("draft"),
  createdAt: createdAt(),
});

// Locked entirely at publish (ADR-0056) — enforced in application code, not by
// a DB trigger, to keep the MVP migration simple.
export const exams = sqliteTable("exams", {
  id: id(),
  examTopicId: text("exam_topic_id")
    .notNull()
    .references(() => examTopics.id),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(50),
  totalMarks: real("total_marks"),
  negativeMarkingEnabled: integer("negative_marking_enabled", { mode: "boolean" })
    .notNull()
    .default(false),
  negativeMarkPerWrong: real("negative_mark_per_wrong").notNull().default(0),
  answerChangeAllowed: integer("answer_change_allowed", { mode: "boolean" })
    .notNull()
    .default(true),
  autosaveEnabled: integer("autosave_enabled", { mode: "boolean" }).notNull().default(true),
  mockEnabled: integer("mock_enabled", { mode: "boolean" }).notNull().default(false),
  mockRetryLimit: integer("mock_retry_limit"),
  resultReleaseMode: text("result_release_mode").notNull().default("automatic"),
  resultReleaseAt: text("result_release_at"),
  status: text("status").notNull().default("draft"),
  publishedAt: text("published_at"),
  createdAt: createdAt(),
});

// Shared question bank (ADR-0055). tenantId null = platform-owned/shared.
export const questions = sqliteTable("questions", {
  id: id(),
  tenantId: text("tenant_id").references(() => tenants.id),
  questionText: text("question_text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctOption: text("correct_option").notNull().$type<"a" | "b" | "c" | "d">(),
  explanation: text("explanation"),
  subject: text("subject"),
  examName: text("exam_name"),
  examYear: integer("exam_year"),
  postName: text("post_name"),
  institution: text("institution"),
  source: text("source"),
  reuseScope: text("reuse_scope")
    .notNull()
    .$type<"platform_reusable" | "teacher_private">()
    .default("platform_reusable"),
  createdAt: createdAt(),
});

export const examQuestionLinks = sqliteTable("exam_question_links", {
  id: id(),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
});

export const questionTags = sqliteTable("question_tags", {
  id: id(),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id),
  tag: text("tag").notNull(),
});

// DB also enforces one live attempt per student per exam via a partial unique
// index (exam_id, student_user_id) WHERE attempt_type = 'live' — not
// representable as a plain column constraint here; see 0001_init.sql.
export const examAttempts = sqliteTable("exam_attempts", {
  id: id(),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id),
  studentUserId: text("student_user_id")
    .notNull()
    .references(() => users.id),
  attemptType: text("attempt_type").notNull().$type<"live" | "mock">(),
  attemptNumber: integer("attempt_number").notNull().default(1),
  startedAt: text("started_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  submittedAt: text("submitted_at"),
  autoSubmitted: integer("auto_submitted", { mode: "boolean" }).notNull().default(false),
  durationSeconds: integer("duration_seconds"),
  score: real("score"),
  rank: integer("rank"),
  mockAnalyticsConsent: integer("mock_analytics_consent", { mode: "boolean" })
    .notNull()
    .default(false),
  status: text("status").notNull().default("in_progress"),
});

export const attemptItems = sqliteTable("attempt_items", {
  id: id(),
  attemptId: text("attempt_id")
    .notNull()
    .references(() => examAttempts.id),
  examQuestionLinkId: text("exam_question_link_id")
    .notNull()
    .references(() => examQuestionLinks.id),
  questionTextSnapshot: text("question_text_snapshot").notNull(),
  optionsSnapshot: text("options_snapshot").notNull(),
  correctOptionSnapshot: text("correct_option_snapshot").notNull().$type<"a" | "b" | "c" | "d">(),
  displayOrder: integer("display_order").notNull(),
  optionOrder: text("option_order").notNull(),
  selectedOption: text("selected_option").$type<"a" | "b" | "c" | "d" | null>(),
  isCorrect: integer("is_correct", { mode: "boolean" }),
  markAwarded: real("mark_awarded"),
  answeredAt: text("answered_at"),
});

export const weakZoneSnapshots = sqliteTable("weak_zone_snapshots", {
  id: id(),
  studentUserId: text("student_user_id")
    .notNull()
    .references(() => users.id),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id),
  subject: text("subject"),
  tag: text("tag"),
  attemptsCount: integer("attempts_count").notNull().default(0),
  questionsCount: integer("questions_count").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  accuracyPercent: real("accuracy_percent"),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const resetCodes = sqliteTable("reset_codes", {
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
});
