-- drizzle-kit's first-ever `generate` run against schema.ts, establishing the
-- baseline snapshot in migrations/meta/ (Step 2's deferred item). All 17
-- tables here already exist — created by the hand-written 0001_init.sql,
-- which stays the source of truth for CHECK constraints and the partial
-- unique index on exam_attempts that schema.ts deliberately omits (see its
-- header comment and .claude/skills/d1-schema/SKILL.md). Every statement
-- below is `IF NOT EXISTS` on purpose: this file's only real job is to give
-- drizzle-kit something to diff future schema.ts changes against, not to
-- execute against any database — it is expected to no-op on both the current
-- local D1 and any future fresh one, since 0001_init.sql always runs first.
CREATE TABLE IF NOT EXISTS `attempt_items` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`attempt_id` text NOT NULL,
	`exam_question_link_id` text NOT NULL,
	`question_text_snapshot` text NOT NULL,
	`options_snapshot` text NOT NULL,
	`correct_option_snapshot` text NOT NULL,
	`display_order` integer NOT NULL,
	`option_order` text NOT NULL,
	`selected_option` text,
	`is_correct` integer,
	`mark_awarded` real,
	`answered_at` text,
	FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exam_question_link_id`) REFERENCES `exam_question_links`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `course_billing_rates` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`course_id` text NOT NULL,
	`price_per_student_bdt` real NOT NULL,
	`set_by_user_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`set_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `course_enrollments` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`course_id` text NOT NULL,
	`student_user_id` text NOT NULL,
	`price_snapshot_bdt` real NOT NULL,
	`access_status` text DEFAULT 'joined_pending_payment' NOT NULL,
	`blocked_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `courses` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`tenant_id` text NOT NULL,
	`title` text NOT NULL,
	`short_description` text,
	`full_syllabus` text,
	`base_price_bdt` real DEFAULT 0 NOT NULL,
	`is_free` integer DEFAULT false NOT NULL,
	`discount_percent` real,
	`discount_start_at` text,
	`discount_end_at` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `exam_attempts` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`exam_id` text NOT NULL,
	`student_user_id` text NOT NULL,
	`attempt_type` text NOT NULL,
	`attempt_number` integer DEFAULT 1 NOT NULL,
	`started_at` text DEFAULT (datetime('now')) NOT NULL,
	`submitted_at` text,
	`auto_submitted` integer DEFAULT false NOT NULL,
	`duration_seconds` integer,
	`score` real,
	`rank` integer,
	`mock_analytics_consent` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `exam_question_links` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`exam_id` text NOT NULL,
	`question_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `exam_topics` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`short_description` text,
	`scheduled_at` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `exams` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`exam_topic_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`duration_minutes` integer DEFAULT 50 NOT NULL,
	`total_marks` real,
	`negative_marking_enabled` integer DEFAULT false NOT NULL,
	`negative_mark_per_wrong` real DEFAULT 0 NOT NULL,
	`answer_change_allowed` integer DEFAULT true NOT NULL,
	`autosave_enabled` integer DEFAULT true NOT NULL,
	`mock_enabled` integer DEFAULT false NOT NULL,
	`mock_retry_limit` integer,
	`result_release_mode` text DEFAULT 'automatic' NOT NULL,
	`result_release_at` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`exam_topic_id`) REFERENCES `exam_topics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `invoices` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`course_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`student_count_snapshot` integer NOT NULL,
	`rate_snapshot_bdt` real NOT NULL,
	`amount_bdt` real NOT NULL,
	`manual_adjustment_bdt` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`generated_by_user_id` text NOT NULL,
	`sent_at` text,
	`paid_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`generated_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `payment_access_requests` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`course_id` text NOT NULL,
	`student_user_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by_user_id` text,
	`reviewed_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `question_tags` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`question_id` text NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `questions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`tenant_id` text,
	`question_text` text NOT NULL,
	`option_a` text NOT NULL,
	`option_b` text NOT NULL,
	`option_c` text NOT NULL,
	`option_d` text NOT NULL,
	`correct_option` text NOT NULL,
	`explanation` text,
	`subject` text,
	`exam_name` text,
	`exam_year` integer,
	`post_name` text,
	`institution` text,
	`source` text,
	`reuse_scope` text DEFAULT 'platform_reusable' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `reset_codes` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`code_hash` text NOT NULL,
	`generated_by_user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`used_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`generated_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `teacher_memberships` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`tenant_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'owner' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `tenants` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo_url` text,
	`banner_url` text,
	`brand_color` text,
	`teacher_picture_url` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `tenants_slug_unique` ON `tenants` (`slug`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`phone_e164` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text NOT NULL,
	`city` text,
	`institution` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_phone_e164_unique` ON `users` (`phone_e164`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `weak_zone_snapshots` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`student_user_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`course_id` text NOT NULL,
	`subject` text,
	`tag` text,
	`attempts_count` integer DEFAULT 0 NOT NULL,
	`questions_count` integer DEFAULT 0 NOT NULL,
	`correct_count` integer DEFAULT 0 NOT NULL,
	`accuracy_percent` real,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`student_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
