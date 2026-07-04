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

## Current Lean Recommendation

Start with a manually assisted exam-pack model:

- Offer an initial pilot pack around 500 BDT for 5 exams with up to 100 students.
- Use 100 BDT per extra 50 students as an initial overage baseline, adjustable by teacher and exam.
- Include limited manual onboarding and question-entry help for the first pilot teachers.
- Track actual support time, number of students per exam, and platform cost.
- After the pilot, move toward pack plus student-volume pricing if large teachers create high load.

This keeps the business understandable while the platform and sales process are still young.

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

- Pilot price: 500 BDT for 5 exams.
- Pilot cap: up to 100 students.
- Overage baseline: 100 BDT per extra 50 students, but final platform price can vary by teacher/course.
- Student-facing price: course-level price only; individual exam topics do not have separate prices in MVP.
- Course price display: course price is visible publicly on the teacher page.
- Free courses: courses can be free.
- Course discount: course can show a percentage discount, such as 30% off.
- Discount schedule: discounts have start and end dates.
- Discount behavior: discounts apply automatically by date and only affect new unenrolled students.
- Course price editing: base course price is not edited after students join in MVP.
- Enrolled price lock: enrolled students keep the price they paid.
- Currency: BDT only in MVP.
- Free course join: free courses auto-approve student join requests, but teacher can still block/remove students.
- Login-required join: students must log in before joining any course, including free courses.
- Free course preview: no public preview before login in MVP.
- Typical exam size: around 50 MCQs.
- Typical duration: 50 minutes for 50 questions, configurable per exam.
- Negative marking: configurable per exam; teacher can disable it or set values such as 0.25 or 0.50.
- Question language: roughly 70% Bangla with some English questions.
- Question import: CSV import is part of MVP, alongside manual entry. XLSX can come later.
- Official CSV template columns: `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`, `subject`, `tags`, `exam_name`, `exam_year`, `post_name`, `institution`, `source`, `reuse_scope`.
- Question import validation: answer is required; explanation is optional.
- Question metadata: detailed tags from day one, including subject, exam name/type, topic, previous-exam appearance, year, post name, institution, and other useful future-exam metadata.
- Initial taxonomy model: flat tags, not a strict tree. Questions can have many tags.
- Initial tag examples: `bangla`, `english`, `math`, `general-knowledge`, `ict`, `subject`, `topic`, `bcs-15`, `primary-2023`, `health-22`, and other exam/source/topic tags.
- Top-level subjects: Bangla, English, Math, General Knowledge, and ICT.
- Course route visibility: future exam topics/syllabus are visible before questions are ready, showing title, short description, and date/time. Marks/question count stay hidden until later.
- Future topic display: topic title plus short description. Date/time is required before publishing a course route.
- Published exam visibility: marks/question count becomes visible once the exam is published.
- Student identity: name, globally unique username, phone, and email required; city and institution optional.
- Username policy: username is created during signup and cannot be edited in MVP. Username must start with a letter and then may contain letters, numbers, and underscores. Minimum length is 3.
- Identity uniqueness: username, phone, and email are globally unique.
- Signup friction guardrail: keep signup one-screen and avoid optional fields during first signup.
- Signup password: password confirmation is required.
- Password rule: minimum 6 characters only; no letter/number composition rule in MVP.
- Signup validation: username availability is checked live while typing. Signup uniqueness errors are explicit for usability.
- Phone format: Bangladesh-only phone numbers in MVP.
- Phone normalization: accept local `01...` format and store normalized `+880...`.
- Phone display: show normalized phone numbers back to users in local `01...` format.
- Email verification: skipped in MVP.
- Email usage: email is used for login/future recovery only in MVP. Teacher email communication is post-MVP.
- Optional profile fields: city and institution are optional forever in MVP and cannot be required by teachers.
- Optional profile fields format: city and institution are free text in MVP.
- Exam identity requirement: before starting any exam, username, phone, and email must be present. If missing, exam start is blocked with a quick completion form.
- Phone edit: phone number can be edited after signup with password confirmation, but must remain Bangladesh-only, normalized, and globally unique. No admin/teacher-visible phone edit audit log in MVP.
- Optional profile visibility: optional city/institution are shown to teachers when available.
- Teacher email communication: not included in MVP.
- Student account model: one student account can join multiple teachers' courses.
- Payment flow: students pay the teacher outside the platform.
- Access flow: students can join a course but exams remain locked until teacher approves payment/access.
- Payment proof: student sends a payment request with transaction ID; teacher checks manually and approves.
- Course access persistence: approved students keep access to past course exams/results unless the teacher removes them.
- Exam timing: students can join during a scheduled time, and teachers may also allow later mock attempts with separate ranking.
- Attempt policy: live exam allows one attempt only; live attempts are not reset/reopened in MVP. Teacher can enable/disable mock mode per exam. Mock exams allow teacher-configured retry limits.
- Mock availability: live exam questions become available for mock only after the live exam ends and result is released.
- Mock results: students can see all mock attempts, and correct answers show immediately after each mock attempt.
- Exam timeout: when time ends, the exam auto-submits.
- Answer changes: teacher configures per exam whether students can change answers before final submit; default is allowed.
- Answer autosave: teacher configures per exam; default is on. When enabled, selected answers save after each selection.
- Internet drop: timer continues; saved answers remain; unsaved answers may be lost. Student is responsible for connection stability.
- Connection indicator: exam page should show online/offline connection status.
- Leave/refresh warning: exam page should warn before browser refresh, close, or leaving the exam page, but normal navigation between exam questions remains available.
- Submit confirmation: students see unanswered question count before final submit, and submission requires confirmation if unanswered questions remain.
- Result visibility: live leaderboard and live result appear only after the exam ends. Teacher configures per exam when live score/correct answers appear and whether result release is automatic or manual.
- Result defaults: result release defaults to automatic 5 minutes after exam end; live score and correct answers default to after exam end.
- Result release delay: fixed 5 minutes in MVP, not configurable per exam.
- Result preview: teacher does not get a pre-release preview in MVP.
- Result unpublish: teacher cannot hide/unpublish result after release in MVP.
- Result correction: teacher cannot edit answers and recalculate released results in MVP.
- Shuffle: live exam questions and options are always shuffled. The shuffled order is fixed per student attempt after the exam starts.
- MVP result page: score, rank, full named leaderboard, and correct answers. No percentile/average in MVP. Full solutions can be added later.
- Leaderboard tie rule: same score shares the same rank; shorter completion time is used as a secondary display/order within the tied rank.
- Print support: teacher can print/export questions for offline exam use, but offline exam data is not tracked in MVP.
- Auth: simple password login without OTP for MVP; login accepts username, phone, or email as identifier.
- Login errors: login errors are vague for privacy/security.
- I18n structure: add translation-file/i18n structure from day one even though launch UI is English-first; include empty Bangla placeholders.
- Password reset: MVP uses manual teacher/admin-assisted one-time reset codes, sent outside the platform through teacher's normal channel such as WhatsApp or phone. No automated SMS/WhatsApp OTP in MVP.
- Reset code policy: both teacher and platform admin can generate reset codes; codes expire after 1 hour.
- Question bank ownership: questions are reusable by the platform by default, unless marked teacher-private by agreement. Teacher-private questions do not cost extra in MVP.
- Official import template: provide one CSV template for platform/admin-assisted imports and teacher training.
- Backup/export policy: no full backup policy for MVP; question sets should be exportable as CSV.
- Budget guardrail: do not spend more than 2,000 BDT/month during early validation. If Cloudflare free limits are hit during pilot, upgrade to paid limits.
- Go-to-market: first channel is wife's known coaching network.
- Pilot support: founder will be available during first live teacher exams.
- First paid offer: start from 500 BDT / 5 exams / 100 students, but can change after teacher conversation.
- Exam duplication: teachers can copy old exams into new exams, and copied exams count as new exams for exam-pack/billing purposes once used/published.
- Payment approval: teacher approves student payment/access requests one by one in MVP.
- Print watermark: print/PDF output should include teacher name and platform name as watermark/header.
- Bangla print quality: Bangla PDF/print layout must be polished from day one.
- Weak-zone report: students should always see weak-zone analysis, updated after every live exam attempt. Mock attempts are included only when the student checks consent before starting the mock.
- Mock analytics consent: unchecked by default.
- Mock analytics consent control: only the student controls whether a mock attempt is included in weak-zone analysis; teacher can view but not edit the student's decision.
- Weak-zone visibility: student sees only their own report; teacher sees reports for students joined to that teacher's courses; platform admin can see all.
- Teacher weak-zone view: individual student details only in MVP; class aggregate can come later.
- Teacher mock visibility: teacher sees only live exam result in MVP, not student mock attempt history.
- Teacher announcements/messages: not included in MVP.
- Teacher branding: teacher page supports logo, banner, color, and user/teacher picture using a common template customized per teacher.
- Teacher deployment model: initial pilots may use separate teacher-specific code/deployments generated from a common template for speed.
- Past exam visibility: past exam list is visible publicly, but results/details are locked for non-enrolled users.
- Public past exam metadata: public past exam list shows full syllabus details, live participant count based on students who started the live attempt, and top score.
- Public top score display: top score shows marks plus required username.
- Locked exam CTA: non-enrolled users see exact price plus payment/join instructions on locked past exams.
- Public top score: top score is always public on the past exam list.
- Removed student access: removing a student blocks future exams only; old results remain accessible.
- Copyright/content terms: teacher accepts once per account that uploaded questions are open/source-safe or owned/authorized by them.
- Question answer model: answers and optional explanations are attached to each exam question.
- Publish validation: system blocks publishing an exam unless every question has an answer.
- Teacher export: teachers cannot export all student results to CSV/XLSX in MVP.
- Admin export: platform admin CSV/XLSX export can come later, not in initial release.
- Admin support: read-only support in MVP; no admin impersonation.
- Account deletion: students cannot self-delete in MVP; admin can archive/deactivate/delete accounts.
- First content operation: platform owner helps add questions, while also teaching teachers to add questions themselves.
