# Data Model Draft

This is a product-level model, not final database DDL.

## Tenant

- `id`
- `name`
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
- `email`
- `password_hash`
- `role`
- `city`
- `institution`
- `status`
- `created_at`

Rules:

- `username`, `phone_e164`, and `email` are globally unique.
- Phone stores `+880...` and displays as local `01...`.
- `password_hash` stores PBKDF2-SHA256 output encoded with its salt and iteration count, for example `pbkdf2$<iterations>$<salt>$<hash>`. See [ADR-0054](adr/0054-jwt-auth-with-pbkdf2-password-hashing.md).
- Login issues a signed JWT (id, role, tenant/course-membership hints) stored in an httpOnly cookie; JWT claims are a UI convenience only, not the source of truth for authorization checks.

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

## Course Enrollment

- `id`
- `course_id`
- `student_user_id`
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

- `removed` only blocks future access (see [ADR-0011](adr/0011-locked-exams-before-payment-approval.md)); a removed student may call the join endpoint again, which resets their existing row back through the normal join flow rather than permanently locking them out.
- `blocked` does not allow the student to self-recover by rejoining — access can only be restored by the teacher. **Known gap**: no unblock endpoint exists yet as of Step 4; a blocked student stays blocked until a future step adds one or an admin edits the row directly.

## Payment Access Request

- `id`
- `course_id`
- `student_user_id`
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
- See [ADR-0053](adr/0053-per-course-negotiated-student-invoicing.md).

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
- See [ADR-0053](adr/0053-per-course-negotiated-student-invoicing.md).

## Exam Topic

- `id`
- `course_id`
- `title`
- `short_description`
- `scheduled_at`
- `sort_order`
- `status`
- `created_at`

Course route publish rule:

- A course can be published once it has `title`, `short_description`, and a price/free status, plus at least one `Exam Topic` with `status = 'published'`, `title`, `short_description`, and `scheduled_at` set. See [ADR-0058](adr/0058-course-route-minimum-publish-fields.md).
- `status` also gates visibility: a topic still at `draft` is only visible to the owning tenant's teacher/admin (via `GET /courses/:id`); non-owning viewers, including students, only ever see `published` topics.

## Exam

- `id`
- `exam_topic_id`
- `tenant_id`
- `course_id`
- `title`
- `description`
- `starts_at`
- `ends_at`
- `duration_minutes`
- `total_marks`
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
- See [ADR-0056](adr/0056-lock-exam-settings-after-publish.md).

## Question

The reusable question-bank record. See [ADR-0055](adr/0055-shared-question-bank-with-exam-links.md).

- `id`
- `tenant_id` (nullable; null means platform-owned/shared)
- `question_text`
- `option_a`
- `option_b`
- `option_c`
- `option_d`
- `correct_option`
- `explanation`
- `subject`
- `exam_name`
- `exam_year`
- `post_name`
- `institution`
- `source`
- `reuse_scope`
- `created_at`

Rules:

- Correct answer is required before any exam linking this question can be published.
- Explanation is optional.
- No image field in MVP.
- `reuse_scope` is `platform_reusable` or `teacher_private`. `teacher_private` questions may only be linked into exams owned by their `tenant_id`.

## Exam Question Link

- `id`
- `exam_id`
- `question_id`
- `sort_order`
- `created_at`

Rules:

- Represents inclusion of a bank `Question` in a specific exam.
- Duplicating an exam duplicates its links: `platform_reusable` questions are re-linked to the same `Question` row; `teacher_private` questions have their `Question` row copied first, then linked.
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
- `*_snapshot` fields freeze the question content as shown at attempt time, so a later edit to the bank `Question` row (for exams that still allow it pre-publish) never changes a historical attempt's record. Since exams are locked at publish (ADR-0056), this is primarily a safety net rather than an expected mutation path.

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
