-- Initial schema for Exam Taker.
-- Source of truth for the product-level model: docs/data-model.md
-- Cross-referenced decisions: docs/adr/0052 (single shared tenant model),
-- 0053 (invoicing), 0054 (auth/password hashing), 0055 (question bank),
-- 0056 (exam publish lock), 0058 (course publish rule).
--
-- Conventions:
-- - All primary keys are TEXT UUID-style, generated via randomblob if not
--   supplied by the application: lower(hex(randomblob(16))).
-- - Timestamps are TEXT ISO-8601 (SQLite/D1 has no native datetime type).
-- - Booleans are INTEGER 0/1 with a CHECK constraint.
-- - Money fields are REAL BDT amounts. Revisit as integer minor units if
--   float precision ever becomes a real reconciliation problem.
-- - D1 migrations are forward-only: never edit an applied migration, add a
--   new numbered one instead (see .claude/skills/d1-schema/SKILL.md).

CREATE TABLE tenants (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  brand_color TEXT,
  teacher_picture_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  phone_e164 TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  city TEXT,
  institution TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deactivated')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (length(username) >= 3 AND username GLOB '[a-zA-Z]*')
);

CREATE TABLE teacher_memberships (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'staff')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (tenant_id, user_id)
);

CREATE TABLE courses (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  title TEXT NOT NULL,
  short_description TEXT,
  full_syllabus TEXT,
  base_price_bdt REAL NOT NULL DEFAULT 0,
  is_free INTEGER NOT NULL DEFAULT 0 CHECK (is_free IN (0, 1)),
  discount_percent REAL,
  discount_start_at TEXT,
  discount_end_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_courses_tenant ON courses(tenant_id);

CREATE TABLE course_enrollments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  course_id TEXT NOT NULL REFERENCES courses(id),
  student_user_id TEXT NOT NULL REFERENCES users(id),
  price_snapshot_bdt REAL NOT NULL,
  access_status TEXT NOT NULL DEFAULT 'joined_pending_payment'
    CHECK (access_status IN ('joined_pending_payment', 'approved', 'blocked', 'removed')),
  blocked_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (course_id, student_user_id)
);

CREATE INDEX idx_enrollments_student ON course_enrollments(student_user_id);
CREATE INDEX idx_enrollments_course_status ON course_enrollments(course_id, access_status);

CREATE TABLE payment_access_requests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  course_id TEXT NOT NULL REFERENCES courses(id),
  student_user_id TEXT NOT NULL REFERENCES users(id),
  transaction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by_user_id TEXT REFERENCES users(id),
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_payment_requests_course_status ON payment_access_requests(course_id, status);

-- Platform-to-teacher billing (docs/adr/0053-per-course-negotiated-student-invoicing.md).
-- Unrelated to courses.base_price_bdt, which is the student-facing price.

CREATE TABLE course_billing_rates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  course_id TEXT NOT NULL REFERENCES courses(id),
  price_per_student_bdt REAL NOT NULL,
  set_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_billing_rates_course ON course_billing_rates(course_id);

CREATE TABLE invoices (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  course_id TEXT NOT NULL REFERENCES courses(id),
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  student_count_snapshot INTEGER NOT NULL,
  rate_snapshot_bdt REAL NOT NULL,
  amount_bdt REAL NOT NULL,
  manual_adjustment_bdt REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'void')),
  generated_by_user_id TEXT NOT NULL REFERENCES users(id),
  sent_at TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_invoices_course ON invoices(course_id);
CREATE INDEX idx_invoices_tenant_status ON invoices(tenant_id, status);

CREATE TABLE exam_topics (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  course_id TEXT NOT NULL REFERENCES courses(id),
  title TEXT NOT NULL,
  short_description TEXT,
  scheduled_at TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_exam_topics_course ON exam_topics(course_id);

-- Exam settings and question links become fully immutable once status = 'published'
-- and stay that way forever once any exam_attempts row exists for the exam.
-- See docs/adr/0056-lock-exam-settings-after-publish.md. Enforce this in the
-- application layer; SQLite triggers are not used here to keep migration
-- logic simple for MVP.

CREATE TABLE exams (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  exam_topic_id TEXT NOT NULL REFERENCES exam_topics(id),
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  course_id TEXT NOT NULL REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 50,
  total_marks REAL,
  negative_marking_enabled INTEGER NOT NULL DEFAULT 0 CHECK (negative_marking_enabled IN (0, 1)),
  negative_mark_per_wrong REAL NOT NULL DEFAULT 0,
  answer_change_allowed INTEGER NOT NULL DEFAULT 1 CHECK (answer_change_allowed IN (0, 1)),
  autosave_enabled INTEGER NOT NULL DEFAULT 1 CHECK (autosave_enabled IN (0, 1)),
  mock_enabled INTEGER NOT NULL DEFAULT 0 CHECK (mock_enabled IN (0, 1)),
  mock_retry_limit INTEGER,
  result_release_mode TEXT NOT NULL DEFAULT 'automatic' CHECK (result_release_mode IN ('automatic', 'manual')),
  result_release_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_exams_course ON exams(course_id);
CREATE INDEX idx_exams_tenant ON exams(tenant_id);
CREATE INDEX idx_exams_topic ON exams(exam_topic_id);

-- Shared question bank (docs/adr/0055-shared-question-bank-with-exam-links.md).
-- A question with tenant_id = NULL is platform-owned/shared. teacher_private
-- questions must carry a tenant_id and may only be linked into that tenant's exams.

CREATE TABLE questions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT REFERENCES tenants(id),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL CHECK (correct_option IN ('a', 'b', 'c', 'd')),
  explanation TEXT,
  subject TEXT,
  exam_name TEXT,
  exam_year INTEGER,
  post_name TEXT,
  institution TEXT,
  source TEXT,
  reuse_scope TEXT NOT NULL DEFAULT 'platform_reusable' CHECK (reuse_scope IN ('platform_reusable', 'teacher_private')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (reuse_scope = 'platform_reusable' OR tenant_id IS NOT NULL)
);

CREATE INDEX idx_questions_tenant ON questions(tenant_id);
CREATE INDEX idx_questions_subject ON questions(subject);

CREATE TABLE exam_question_links (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  exam_id TEXT NOT NULL REFERENCES exams(id),
  question_id TEXT NOT NULL REFERENCES questions(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (exam_id, question_id)
);

CREATE INDEX idx_exam_question_links_exam ON exam_question_links(exam_id);

CREATE TABLE question_tags (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  question_id TEXT NOT NULL REFERENCES questions(id),
  tag TEXT NOT NULL,
  UNIQUE (question_id, tag)
);

CREATE INDEX idx_question_tags_tag ON question_tags(tag);

CREATE TABLE exam_attempts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  exam_id TEXT NOT NULL REFERENCES exams(id),
  student_user_id TEXT NOT NULL REFERENCES users(id),
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('live', 'mock')),
  attempt_number INTEGER NOT NULL DEFAULT 1,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  submitted_at TEXT,
  auto_submitted INTEGER NOT NULL DEFAULT 0 CHECK (auto_submitted IN (0, 1)),
  duration_seconds INTEGER,
  score REAL,
  rank INTEGER,
  mock_analytics_consent INTEGER NOT NULL DEFAULT 0 CHECK (mock_analytics_consent IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted'))
);

CREATE INDEX idx_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX idx_attempts_student ON exam_attempts(student_user_id);

-- Enforce "one live attempt per student per exam" (ADR-0039) at the DB level
-- with a partial unique index; mock attempts are exempt.
CREATE UNIQUE INDEX idx_one_live_attempt_per_student
  ON exam_attempts(exam_id, student_user_id)
  WHERE attempt_type = 'live';

CREATE TABLE attempt_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  attempt_id TEXT NOT NULL REFERENCES exam_attempts(id),
  exam_question_link_id TEXT NOT NULL REFERENCES exam_question_links(id),
  question_text_snapshot TEXT NOT NULL,
  options_snapshot TEXT NOT NULL,
  correct_option_snapshot TEXT NOT NULL CHECK (correct_option_snapshot IN ('a', 'b', 'c', 'd')),
  display_order INTEGER NOT NULL,
  option_order TEXT NOT NULL,
  selected_option TEXT CHECK (selected_option IN ('a', 'b', 'c', 'd')),
  is_correct INTEGER CHECK (is_correct IN (0, 1)),
  mark_awarded REAL,
  answered_at TEXT,
  UNIQUE (attempt_id, exam_question_link_id)
);

CREATE INDEX idx_attempt_items_attempt ON attempt_items(attempt_id);

CREATE TABLE weak_zone_snapshots (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  student_user_id TEXT NOT NULL REFERENCES users(id),
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  course_id TEXT NOT NULL REFERENCES courses(id),
  subject TEXT,
  tag TEXT,
  attempts_count INTEGER NOT NULL DEFAULT 0,
  questions_count INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  accuracy_percent REAL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (student_user_id, course_id, subject, tag)
);

CREATE INDEX idx_weak_zone_student ON weak_zone_snapshots(student_user_id);

CREATE TABLE reset_codes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  code_hash TEXT NOT NULL,
  generated_by_user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_reset_codes_user ON reset_codes(user_id);
