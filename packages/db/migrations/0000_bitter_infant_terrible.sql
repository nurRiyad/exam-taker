CREATE TABLE `attempt_items` (
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
CREATE INDEX `idx_attempt_items_attempt` ON `attempt_items` (`attempt_id`);--> statement-breakpoint
CREATE TABLE `batch_access_requests` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`batch_id` text NOT NULL,
	`student_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewed_by_user_id` text,
	`reviewed_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_batch_access_requests_batch_status` ON `batch_access_requests` (`batch_id`,`status`);--> statement-breakpoint
CREATE TABLE `batch_memberships` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`batch_id` text NOT NULL,
	`student_id` text NOT NULL,
	`price_snapshot_bdt` real NOT NULL,
	`access_status` text DEFAULT 'joined_pending_payment' NOT NULL,
	`blocked_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_batch_memberships_student_batch` ON `batch_memberships` (`student_id`,`batch_id`);--> statement-breakpoint
CREATE INDEX `idx_batch_memberships_batch_status` ON `batch_memberships` (`batch_id`,`access_status`);--> statement-breakpoint
CREATE TABLE `batches` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'upcoming' NOT NULL,
	`capacity` integer,
	`syllabus` text,
	`materials` text,
	`first_exam_date` text,
	`exam_time` text,
	`exam_interval_days` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_batches_course` ON `batches` (`course_id`);--> statement-breakpoint
CREATE TABLE `course_billing_rates` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`course_id` text NOT NULL,
	`price_per_student_bdt` real NOT NULL,
	`set_by_user_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`set_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `courses` (
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
CREATE INDEX `idx_courses_tenant` ON `courses` (`tenant_id`);--> statement-breakpoint
CREATE TABLE `exam_attempts` (
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
CREATE INDEX `idx_attempts_exam` ON `exam_attempts` (`exam_id`);--> statement-breakpoint
CREATE INDEX `idx_attempts_student` ON `exam_attempts` (`student_user_id`);--> statement-breakpoint
CREATE TABLE `exam_question_links` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`exam_id` text NOT NULL,
	`question_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_exam_question_links_exam_question` ON `exam_question_links` (`exam_id`,`question_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_exam_question_links_exam_order` ON `exam_question_links` (`exam_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `exams` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`batch_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`topic_text` text,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`duration_minutes` integer DEFAULT 50 NOT NULL,
	`total_marks` real,
	`mark_per_correct` real DEFAULT 1 NOT NULL,
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
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_exams_batch_schedule` ON `exams` (`batch_id`,`starts_at`);--> statement-breakpoint
CREATE INDEX `idx_exams_tenant` ON `exams` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `idx_exams_course` ON `exams` (`course_id`);--> statement-breakpoint
CREATE TABLE `invoices` (
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
CREATE TABLE `question_options` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`question_id` text NOT NULL,
	`option_text` text NOT NULL,
	`sort_order` integer NOT NULL,
	`is_correct` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_question_options_question_order` ON `question_options` (`question_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `question_tags` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`question_id` text NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_question_tags_question_tag` ON `question_tags` (`question_id`,`tag`);--> statement-breakpoint
CREATE INDEX `idx_question_tags_tag_question` ON `question_tags` (`tag`,`question_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`tenant_id` text NOT NULL,
	`question_text` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`explanation` text,
	`subject` text,
	`exam_name` text,
	`exam_year` integer,
	`post_name` text,
	`institution` text,
	`source` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_questions_tenant_status_created` ON `questions` (`tenant_id`,`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `reset_codes` (
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
CREATE INDEX `idx_reset_codes_user` ON `reset_codes` (`user_id`);--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`tenant_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone_e164` text NOT NULL,
	`password_hash` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_students_tenant_email` ON `students` (`tenant_id`,`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_students_tenant_phone` ON `students` (`tenant_id`,`phone_e164`);--> statement-breakpoint
CREATE TABLE `teacher_memberships` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`tenant_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'owner' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_teacher_memberships_user_unique` ON `teacher_memberships` (`user_id`);--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo_url` text,
	`banner_url` text,
	`brand_color` text,
	`teacher_picture_url` text,
	`specialty` text,
	`biography` text,
	`teaching_subjects` text,
	`institution` text,
	`division` text,
	`district` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_slug_unique` ON `tenants` (`slug`);--> statement-breakpoint
CREATE TABLE `users` (
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
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_e164_unique` ON `users` (`phone_e164`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `weak_zone_snapshots` (
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
--> statement-breakpoint
CREATE INDEX `idx_weak_zone_student` ON `weak_zone_snapshots` (`student_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX idx_attempts_one_live_per_student
ON exam_attempts(exam_id, student_user_id)
WHERE attempt_type = 'live';
