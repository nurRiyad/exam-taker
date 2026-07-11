# Exam Taker Product Brief

## One-line Idea

A mobile-first exam platform that lets local coaching teachers sell structured government-job preparation routes, run scheduled MCQ exams, publish rankings, and help students understand weak areas without each teacher needing to build their own edtech product.

## Target Market

Primary market:

- Rural and semi-urban Bangladesh coaching teachers who already run low-cost exam-prep programs manually.
- Students preparing for common government job exams who mostly use mobile phones and are price-sensitive.

Initial buyer:

- The teacher or coaching owner.

Initial user:

- Students enrolled under a specific teacher's course.

Primary product language:

- English-first launch UI, built so Bangla can be added easily. Admin UI stays English-only. Teacher and student UI should support Bangla later.

## Core Insight

Some teachers already sell a simple but valuable habit: a planned route of topics and dated MCQ exams. The business is not about replacing teachers. The business is about giving those teachers a branded, easy, low-cost digital exam system.

The sharper first wedge is not a full course platform. The first wedge is replacing printed/offline MCQ exam operations:

- Teachers currently pay or spend effort to prepare printed questions.
- Students must physically go somewhere to sit for the exam.
- Result checking is manual or student-driven.
- There is no reliable live ranking, average performance tracking, or weak-zone analysis.

## Early Known Prospects

- Golding Coaching.
- Rokibul Sir.

Known rough student counts:

- One teacher/coaching has around 300 students.
- Another teacher has 80+ students.

## Value Proposition

For teachers:

- Branded course page under a teacher-specific URL.
- Easy course, route, exam, and question setup.
- Scheduled exams without managing paper, WhatsApp chaos, or manual ranking.
- More professional presence without building software.

For students:

- Join teacher courses from mobile.
- Attend scheduled MCQ exams.
- See score, rank, and explanations.
- Understand weak zones over time.

For the platform owner:

- Repeatable SaaS-like revenue from many small teachers.
- Potential network effects through student accounts and shared exam infrastructure.

## MVP Scope

Teacher:

- Create profile and public page.
- Create course.
- Create exam route/schedule.
- Define exam topics/syllabus items for a course.
- Create MCQ exam.
- Add questions quickly.
- Get platform-assisted question entry during early onboarding.
- Export or print exam questions for offline use.
- Publish exam result and ranking.
- Configure result visibility per exam.
- Configure whether result release is automatic after exam end or manually published.
- Configure negative marking per exam.
- Import questions from CSV.
- Configure whether students can change answers before final submit.
- Configure answer autosave behavior per exam.
- Configure whether profile completion is required before taking an exam.
- Duplicate old exams to create new exams faster.
- Approve student payment/access requests one by one.
- Help students reset passwords through a manual one-time reset code flow.

Student:

- Register/login with phone-first flow.
- Maintain one account that can join multiple teachers' courses.
- Join course.
- Request access after paying the teacher outside the platform.
- See locked exams while payment/access is pending.
- See upcoming exams.
- Take scheduled MCQ exam on mobile.
- Take the same exam later as an online mock if the teacher allows it.
- See score and rank after exam.
- See full leaderboard with student names.
- Review correct answers after result release.
- See weak zones by subject/topic.
- Request password reset help when they forget their password.

Platform admin:

- Create/approve teacher accounts.
- Create teacher pages from a common code/template.
- Deploy separate teacher-specific versions during the first pilot if that is faster.
- See basic usage and payment status.
- Use read-only support views during MVP.
- Print/export exams when supporting a teacher.
- Generate/support manual password reset codes when needed.

## Non-goals For MVP

- Full learning management system.
- Video hosting.
- Live classes.
- Complex question types beyond MCQ.
- AI-generated questions.
- Advanced anti-cheat/proctoring.
- Native mobile apps.
- Offline paper-exam result entry.
- Full written solution/explanation requirement for every question.
- Teacher-facing result export to CSV/XLSX.
- Image-to-question extraction from uploaded photos.
- Image-based MCQs with diagrams/photos inside questions.

## Business Model Options

Option A: One-time setup fee

- Teacher pays a setup fee to launch their branded page.
- Simple to explain.
- Weak recurring revenue.

Option B: Monthly subscription per teacher

- Teacher pays a fixed monthly fee.
- Predictable revenue.
- Harder for very small teachers unless pricing is low.

Option C: Per active student fee

- Teacher pays based on actual student usage.
- Aligns with teacher success.
- Requires tracking, billing discipline, and trust.

Option D: Hybrid

- Small setup fee plus low monthly subscription or per-student usage fee.
- Best candidate for MVP because it filters unserious teachers while keeping recurring upside.

Option E: Exam pack pricing

- Teacher buys a pack, for example 500 BDT for 5 exams.
- Additional cost can scale by number of students or exams.
- Easier to understand because it maps to the teacher's existing exam workflow.
- Risk: low price may not cover support, question-entry help, and reliability expectations.

## Current Lean Recommendation (Historical — Superseded)

This section captured the original exam-pack pricing hypothesis (500 BDT/5 exams/100 students) explored during discovery. **The live billing mechanism is per-course, negotiated per-student rate, manually invoiced by admin — see [ADR-0053](adr/0053-per-course-negotiated-student-invoicing.md).** Kept here only for the reasoning trail; do not treat the exam-pack numbers below as current.

- Offer an initial pilot pack around 500 BDT for 5 exams with up to 100 students.
- Use 100 BDT per extra 50 students as an initial overage baseline, adjustable by teacher and exam.
- Include limited manual onboarding and question-entry help for the first pilot teachers.
- Track actual support time, number of students per exam, and platform cost.

## Key Risks

- Teachers may not consistently create good questions.
- Question entry may be too hard on mobile.
- Manual question-entry help may become an operational bottleneck.
- Students may resist account creation or payment friction.
- Teachers may not want recurring fees.
- Scheduled exams need reliability during traffic spikes.
- If a live exam fails, both teacher and platform lose trust.
- Teacher branding and ownership expectations may conflict with platform control.
- Copying/leaking questions may reduce perceived value.

## Success Metrics

Teacher activation:

- Teacher creates first course.
- Teacher creates first route.
- Teacher publishes first exam.

Student activation:

- Student joins course.
- Student attends first exam.

Engagement:

- Exams completed per course per month.
- Student exam attendance rate.
- Student return rate for next exam.

Business:

- Paying teachers.
- Revenue per teacher.
- Active students per teacher.
- Support time per teacher.

## MVP Discovery Status

The MVP discovery questions are sufficiently answered to start implementation planning. Remaining unknowns should be handled as pilot operating policy, not product blockers.

## Current Product Defaults

Moved to avoid drift between duplicate copies: the full, current list of product defaults lives in `docs/mvp-spec.md` (organized by feature area) and, for anything decision-level, in the specific ADR under `docs/adr/`. `docs/README.md`'s ADR index is the fastest way to find the right one.
