# Data Model

This describes the fresh-start Drizzle schema in `packages/db/src/schema/index.ts`.
The hierarchy is **teacher page → course → batch → exam → MCQs**. Students join only
batches. Every course needs a batch; the application creates a default batch when needed.
Batch syllabus/materials are simple text lists. Exam topics are text on each exam.
Questions belong to one teacher tenant; teachers access their own questions and admins
can access questions across tenants. Tenant-scoped API queries enforce this rule.

## Tenant

- `id`
- `name` (profile-completion field; API may expose `null` before completion)
- `slug`
- `logo_url`
- `banner_url`
- `brand_color`
- `teacher_picture_url`
- `status`
- `created_at`

## User

- `id`
- `name`
- `username`
- `phone_e164`
- `email` (profile-completion field; API may expose `null` before completion)
- `password_hash`
- `role`
- `city`
- `institution`
- `status`
- `created_at`

Rules:

- `username` and `phone_e164` are globally unique at signup. Real completed emails are globally unique; initial signup may use an internal placeholder until profile completion ().
- Phone stores `+880...` and displays as local `01...`.
- `password_hash` stores PBKDF2-SHA256 output encoded with its salt and iteration count, for example `pbkdf2$<iterations>$<salt>$<hash>`. See [].
- Login accepts username or phone and issues a signed JWT stored as a bearer token client-side; JWT claims are a UI convenience only, not the source of truth for authorization checks (, ).

## Teacher Membership

- `id`
- `tenant_id`
- `user_id`
- `role`
- `created_at`

## Course

- `id`
- `tenant_id`
- `title`
- `short_description`
- `full_syllabus`
- `base_price_bdt`
- `is_free`
- `discount_percent`
- `discount_start_at`
- `discount_end_at`
- `status`
- `created_at`

## Batch

- `id`, `course_id`, `title`, `description`, `is_default`, `status`, `capacity`
- `syllabus`, `materials` (simple text lists)
- `first_exam_date`, `exam_time`, `exam_interval_days`, `created_at`

## Batch Membership

- `id`
- `batch_id`
- `student_id`
- `price_snapshot_bdt`
- `access_status`
- `blocked_at`
- `created_at`

Access states:

- `joined_pending_payment`
- `approved`
- `blocked`
- `removed`

Rules:

- `removed` only blocks future access (see []); a removed student may call the join endpoint again, which resets their existing row back through the normal join flow rather than permanently locking them out.
- `blocked` does not allow the student to self-recover by rejoining — access can only be restored by the teacher. **Known gap**: no unblock endpoint exists yet as of Step 4; a blocked student stays blocked until a future step adds one or an admin edits the row directly.

## Batch Access Request

- `id`
- `batch_id`
- `student_id`
- `transaction_id`
- `status`
- `reviewed_by_user_id`
- `reviewed_at`
- `created_at`

## Course Billing Rate

- `id`
- `course_id`
- `price_per_student_bdt`
- `set_by_user_id`
- `created_at`

Rules:

- This is the platform's private negotiated rate charged to the teacher for this course. It is unrelated to `Course.base_price_bdt`, which is the student-facing price.
- See [].

## Invoice

- `id`
- `course_id`
- `tenant_id`
- `student_count_snapshot`
- `rate_snapshot_bdt`
- `amount_bdt`
- `manual_adjustment_bdt`
- `status`
- `generated_by_user_id`
- `sent_at`
- `paid_at`
- `created_at`

Status values:

- `draft`
- `sent`
- `paid`
- `void`

Rules:

- One invoice belongs to exactly one course and one tenant.
- `amount_bdt` defaults to `student_count_snapshot x rate_snapshot_bdt`, adjustable via `manual_adjustment_bdt` for negotiated one-off changes.
- Generated and transitioned manually by admin; no automated recurring billing in MVP.
- See [].

## Exam

- `id`
- `batch_id`
- `tenant_id`
- `course_id`
- `title`
- `description`
- `topic_text`
- `starts_at`
- `ends_at`
- `duration_minutes`
- `total_marks`
- `mark_per_correct`
- `negative_marking_enabled`
- `negative_mark_per_wrong`
- `answer_change_allowed`
- `autosave_enabled`
- `mock_enabled`
- `mock_retry_limit`
- `result_release_mode`
- `result_release_at`
- `status`
- `published_at`
- `created_at`

Defaults:

- 50 questions / 50 minutes where applicable.
- Autosave on.
- Answer change allowed.
- Result release automatic 5 minutes after exam end.
- Mock retry limit unlimited unless teacher sets a value.

Publish lock:

- Once `status` becomes `published`, all fields above and all `Exam Question Link` rows are immutable.
- Reverting to draft is only allowed if zero `Exam Attempt` rows exist for this exam. Once any attempt exists, the exam can never be edited or unpublished again; corrections require duplicating into a new exam.
- See [].

## Question

Questions are reusable within one teacher tenant. Admins can view questions across tenants; teachers can view only their own tenant records.

- `id`
- `tenant_id` (required)
- `question_text`
- `status`
- `explanation`
- `subject`
- `exam_name`
- `exam_year`
- `post_name`
- `institution`
- `source`
- `created_at`

Options are stored in `question_options` with option text, sort order, and an `is_correct` flag. The application validates the option count and exactly one correct answer before publishing. Explanation and source metadata are optional and can be surfaced in the UI incrementally.

## Exam Question Link

- `id`
- `exam_id`
- `question_id`
- `sort_order`
- `created_at`

Marks and negative marking are configured at the exam level.

Rules:

- Represents inclusion of a bank `Question` in a specific exam.
- Duplicate an exam by linking questions from the same tenant-owned bank.
- Locked (immutable) once the exam is published; see the Exam publish-lock rule above.

## Question Tag

- `id`
- `question_id`
- `tag`

Rules:

- Tags are flat.
- Tags use lowercase slug format where possible.

## Exam Attempt

- `id`
- `exam_id`
- `student_user_id`
- `attempt_type`
- `attempt_number`
- `started_at`
- `submitted_at`
- `auto_submitted`
- `duration_seconds`
- `score`
- `rank`
- `mock_analytics_consent`
- `status`

Attempt types:

- `live`
- `mock`

Rules:

- One live attempt per student per exam.
- Multiple mock attempts allowed by teacher config.

## Attempt Item

- `id`
- `attempt_id`
- `exam_question_link_id`
- `question_text_snapshot`
- `options_snapshot`
- `correct_option_snapshot`
- `display_order`
- `option_order`
- `selected_option`
- `is_correct`
- `mark_awarded`
- `answered_at`

Purpose:

- Stores stable shuffled question/order state per student attempt.
- `*_snapshot` fields freeze the question content as shown at attempt time, so a later edit to the bank `Question` row (for exams that still allow it pre-publish) never changes a historical attempt's record. Since exams are locked at publish (), this is primarily a safety net rather than an expected mutation path.

## Weak Zone Snapshot

- `id`
- `student_user_id`
- `tenant_id`
- `course_id`
- `subject`
- `tag`
- `attempts_count`
- `questions_count`
- `correct_count`
- `accuracy_percent`
- `updated_at`

## Reset Code

- `id`
- `user_id`
- `code_hash`
- `generated_by_user_id`
- `expires_at`
- `used_at`
- `created_at`

Rules:

- Expires after 1 hour.
- Generated by teacher or admin.
