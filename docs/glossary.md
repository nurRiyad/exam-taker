# Glossary

## Platform

The overall software business that hosts teacher pages, courses, exams, students, rankings, and analytics.

## Teacher

The paying or revenue-generating customer who creates courses, exam routes, exams, and questions. A teacher may be an individual teacher, coaching owner, or admin working for a coaching brand.

## Student

The learner who joins a course and participates in scheduled MCQ exams from a mobile-first interface.

## Teacher Page

A branded public page for one teacher or coaching brand. Example: `teacing.com/habib-sir`.

## Teacher Branding

Teacher page customization using logo, banner, color, and teacher/user picture.

## Teacher Template Deployment

Superseded. Early plan to generate separate per-teacher code deployments from a shared template; replaced by a single shared multi-tenant deployment from day one (see Tenant, and ADR-0052).

## Tenant

A logically separated teacher/coaching space inside one shared multi-tenant deployment (ADR-0052). Each tenant has its own courses, students, exams, results, and branding, scoped by `tenant_id` within the same app and database.

## Course

A paid or free preparation program created by a teacher. A course contains a route and scheduled exams.

## Course Price

The student-facing price for joining a course. MVP pricing is course-level, not per exam topic.

## Course Discount

A public percentage discount shown on a course price, such as 30% off. Discounts have start and end dates, apply automatically, and only affect new unenrolled students. Base course price is not edited after students join in MVP.

## Enrolled Price Lock

Rule that an enrolled student keeps the price they paid even if the course discount changes later.

## Free Course

A course with no student-facing price. Free courses auto-approve student join requests in MVP, but teachers can still block/remove students.

## BDT

Bangladeshi taka. MVP supports BDT only.

## English-first I18n-ready

Product-language decision that MVP launches in English first while being structured so Bangla can be added easily. Admin UI remains English-only; teacher/student UI should support Bangla later. Translation/i18n structure exists from day one with empty Bangla placeholders.

## Username

Required globally unique public student handle used in public top-score and ranking contexts. Username is created during signup and cannot be edited in MVP. It must start with a letter, may contain letters/numbers/underscores, and must be at least 3 characters.

## Fast Signup

Signup design guardrail: required identity fields remain unique, but signup should stay one-screen and avoid optional fields during first signup.

## Skippable Profile Completion

Post-signup prompt for optional fields such as city and institution. MVP allows students to skip it, and teachers cannot require these fields.

## Exam Identity Requirement

Exam-start rule that username, phone, and email must be present before a student can start an exam.

## Bangladesh-only Phone

MVP phone-number rule that accepts Bangladesh phone numbers only. Signup can accept local `01...` format, but storage should normalize to `+880...`.

## Local Phone Display

Display rule where normalized `+880...` phone numbers are shown back to users as local `01...` numbers.

## Profile Completion Reminder

Skippable prompt for optional fields such as city and institution, shown after joining a first course and later around course/exam activity.

## Profile Completion Requirement

Product rule that required identity fields must be complete before starting any exam. Optional city/institution remain free-text profile fields in MVP.

## Teacher Email Communication

Post-MVP feature. Teacher email communication is not included in MVP.

## Phone Edit Confirmation

Rule that phone edits after signup require password confirmation and must pass Bangladesh-only normalization and global uniqueness checks.

## Live Username Check

Signup behavior where username availability is checked while the student types.

## Vague Login Error

Login error style that avoids revealing whether a username, phone, or email exists.

## Login-required Join

Rule that students must log in before joining any course, including free courses.

## Exam Topic

A course syllabus item or topic that can map to one exam or a group of exams. A course may have one exam topic or many exam topics.

## Future Exam Topic

A planned exam topic/syllabus item visible before questions are ready. MVP shows title, short description, and required date/time. Marks/question count stay hidden until exam publish.

## Route

The teacher's study/exam plan: dates, topics, marks, and exam schedule. This is a core product concept because it matches the existing offline business.

## Exam

A scheduled MCQ test attached to a course route. An exam has start/end time, marks, questions, settings, submissions, and results.

## Exam Settings

Per-exam configuration such as duration, result visibility, mock availability, marks, negative marking, and whether correct answers appear immediately or after the live window.

## Shuffle

Exam behavior where question order and option order are randomized. MVP shuffles questions and options by default.

## Stable Attempt Order

The stored shuffled question and option order for a specific student attempt. Refreshing the exam page should show the same order.

## Auto-submit

Exam behavior where the current attempt is submitted automatically when time ends.

## Answer Autosave

Exam setting that saves a student's selected answer after each selection.

## Answer Change Policy

Exam setting that controls whether students can change selected answers before final submission.

## Live Attempt

The official attempt during the live exam window. MVP allows one live attempt per student per exam.

## Mock Retry

Additional practice attempt after the live exam window. MVP allows teacher-configured retry limits.

## Mock Mode

Teacher-controlled setting that allows students to take practice attempts after the live exam ends and result is released.

## Teacher Mock Visibility

MVP rule that teachers see live exam results only, not student mock attempt history.

## Leave Warning

Browser/page warning shown if a student tries to refresh, close, or leave the exam page during an attempt.

## Connection Indicator

Exam-page indicator showing whether the browser appears online or offline.

## Unanswered Count

The number of questions the student has not answered yet. MVP shows this before final submit.

## Submit Confirmation

Confirmation shown before final submission, especially when unanswered questions remain.

## Negative Marking

An exam setting where incorrect answers reduce the student's score. MVP should allow teachers to disable it or configure values such as 0.25 or 0.50 per wrong answer.

## MCQ

Multiple-choice question. MVP supports one correct answer per question.

## Question Bank

The shared collection of reusable `Question` records, decoupled from any single exam. An exam includes bank questions through an `Exam Question Link` rather than owning its own copy of the text. See ADR-0055.

## Exam Question Link

The join record connecting a bank `Question` to a specific exam, with its sort order in that exam. Duplicating or reusing a question creates a new link rather than copying question content, except for teacher-private questions moved across tenants, which copy the underlying question first.

## Teacher-private Question

A question that should not be reused across other teachers because a teacher specifically claims or requires private ownership. Its `Question` row can only be linked into exams owned by its own tenant.

## Reusable Platform Question

A question that the platform can reuse across teachers, exams, or future question banks by default. Its `Question` row has no owning tenant and can be linked into any tenant's exam.

## Question Import

Teacher or admin workflow for adding questions in bulk from CSV/XLSX files. This is part of MVP because many teachers already use computer shops or typed files for question preparation.

## Official Import Template

The platform-provided CSV/XLSX format teachers or admins use for bulk question import.

## Platform-assisted Question Entry

An early operating model where the platform owner or support team helps enter questions for teachers, because many target teachers currently rely on computer shops or other people to type exam content.

## Explanation

The teacher-provided solution note shown to students after result release or answer review.

## Rank

The student's position compared with other exam participants.

## Leaderboard

The ranked list of students for an exam. MVP shows a full leaderboard with student names.

## Tie Rule

The rule for ranking equal scores. MVP uses the same rank for tied scores, with shorter completion time used as secondary ordering/display inside that tied rank.

## Weak Zone

A topic or subject area where a student repeatedly performs poorly across exams.

## Question Tag

Metadata attached to a question. MVP tags should support detailed topic, exam type, and previous-exam appearance so weak-zone analysis and question reuse become meaningful.

## Flat Tag Taxonomy

Tag model where questions can have many independent tags rather than belonging to one strict tree.

## Subject Tag

Top-level question category such as Bangla, English, Math, General Knowledge, or ICT.

## Exam Name Tag

Metadata for the exam category or source context the question belongs to, such as BCS, primary teacher recruitment, bank job, or another government-job exam.

## Previous-exam Tag

A question tag showing that a question appeared in a past exam. It may include exam name, year, post, institution, or source details.

## Result Release

The moment when students can see scores, ranks, correct answers, and explanations.

## Result Release Mode

Exam setting that controls whether result release happens automatically after the exam ends or manually by the teacher.

## Result Release Delay

Delay between exam end and automatic result release. MVP uses a fixed 5-minute delay.

## Course Access Persistence

Access rule where approved students keep access to past course exams/results unless the teacher removes them.

## Past Exam Visibility

Public course-page behavior where past exam titles/dates can be visible to everyone, but results and details remain locked for non-enrolled users.

## Locked Exam CTA

Exact price plus payment or join instruction shown to non-enrolled users when they view a locked exam.

## Live Participant Count

Participant count based on students who started the live attempt, not mock attempts.

## Public Top Score

Top score shown publicly on past exam lists. MVP shows marks plus required username.

## Publish Validation

Checks required before an exam can be published. MVP blocks publishing unless every question has an answer.

## Result Correction

Editing answers and recalculating results after an exam. This is not supported in MVP.

## Live Exam Window

The scheduled time when students are expected to participate together, similar to a real exam.

## Mock Attempt

A later attempt allowed by the teacher after the live exam window. Mock attempts may need separate ranking so they do not distort the live exam result.

## Payment Status

The teacher-controlled access state showing whether a student has paid outside the platform and can access a course or exam.

## Payment Request

A student-created request asking the teacher to update access after offline payment. MVP proof can be a transaction ID entered by the student.

## One-time Reset Code

A short-lived password reset code generated by teacher or platform admin and sent manually to the student's registered phone/WhatsApp outside the platform.

## Mock Analytics Consent

Student checkbox before a mock attempt that decides whether the mock result should be included in weak-zone analysis.

## Image-based MCQ

An MCQ that includes an image, diagram, or photo inside the question. This is not part of the initial release.

## Weak-zone Visibility

Permission rule for weak-zone reports: students see only their own report, teachers see reports for students joined to their courses, and platform admins can see all.

## Locked Exam

An exam visible to a joined student but unavailable until the teacher approves payment/access.

## Print Export

A teacher-facing feature for printing or exporting the same exam questions for offline paper exams. MVP does not track offline submissions or offline scores.

## Print Watermark

Teacher and platform branding included in printed/PDF exam output, such as teacher name and platform name in the header or watermark.

## Content Responsibility Terms

The terms a teacher accepts before upload/import, confirming that questions are open/source-safe or owned/authorized by the teacher and that the teacher is responsible for uploaded content.

## Question Answer

The correct answer attached to an exam question. Explanations are optional and can be added later.

## Result Export

CSV/XLSX export of student results. Teacher-facing result export is not part of MVP.

## Question Set Export

CSV export of question sets. This is the MVP export/backup path for question content.

## Account Archive

Admin-controlled state for deactivating or archiving a student account. Students cannot self-delete accounts in MVP.

## Read-only Admin Support

MVP support model where platform admin can view teacher/student state for troubleshooting but cannot act as that user.

## Admin Impersonation

Post-MVP support capability where platform admin can act as a teacher/student. This is intentionally excluded from MVP because it needs audit logging and careful permission control.

## Teacher Brand Template

A shared page/deployment template customized per teacher with logo, banner, color, and teacher/user picture.

## Pilot Terms

Plain-language agreement for the first paid teachers covering pricing, included exams, student cap, content responsibility, downtime expectations, refund policy, and support boundaries.

## Active Student

Resolved (ADR-0053): the billing unit is the count of approved/enrolled students in a specific course at the moment an invoice is generated, not a cross-course or time-window concept.

## Course Billing Rate

The platform's private negotiated per-student rate charged to a teacher for a specific course (`price_per_student_bdt`). Distinct from the course's student-facing price. See ADR-0053.

## Invoice

A per-course bill generated manually by admin, computed from the course's approved-student-count snapshot times its negotiated `Course Billing Rate`, with an optional manual adjustment. Tracked through `draft -> sent -> paid`/`void`. Replaces exam-pack usage billing. See ADR-0053.

## Exam Pack

Historical MVP pricing framing (500 BDT for 5 exams), used for the first pilot offer language in `docs/pilot-terms.md`. Superseded as the actual platform-to-teacher billing mechanism by per-course `Invoice`s (ADR-0053).

## Exam Duplication

Teacher workflow for copying an old exam to create a new one faster. Duplication itself is unrestricted; it no longer counts against any exam-pack billing limit, since billing is per-course/student-count (ADR-0053).

## JWT Session

The signed token (HS256) issued at login, returned in the response body and sent back as an `Authorization: Bearer` header on every request (stored client-side in a non-httpOnly cookie so both the browser and Next.js Server Components can read it), containing user id, role, and tenant/course-membership hints. A convenience for identity and UI gating; server-side authorization still checks real DB relationships. See ADR-0054, ADR-0064.
