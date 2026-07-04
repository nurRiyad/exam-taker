# MVP Specification

## Product Shape

A mobile-first exam platform for Bangladesh coaching teachers who run low-cost BCS/government-job preparation exams. The first version helps teachers publish branded pages, sell or offer courses, schedule MCQ exams, run live attempts, show rankings, and help students find weak zones.

## Roles

- Platform admin: creates teacher pages, supports imports, views support data, generates reset codes, and can print/export exams for support.
- Teacher: creates courses, routes, exam topics, exams, questions, pricing, and payment approvals.
- Student: signs up, joins courses, requests access, takes exams, sees results, and tracks weak zones.

## Teacher Page

- Public page per teacher/coaching.
- Supports logo, banner, color, and teacher/user picture.
- Initial pilots may use separate teacher-specific deployments generated from a common template.
- Public course list shows course title, short description, price/free status, discount, and exam route summary.

## Course

- Course-level price only; no per-exam price in MVP.
- Free courses allowed.
- Discount is percentage-only with start/end date.
- Enrolled students keep their paid price.
- Free course join is auto-approved after login.
- Teacher can block/remove students from future access.

## Course Route And Exam Topics

- A course can have one or many exam topics.
- Future exam topics are visible before questions are ready.
- Future topic fields: title, short description, date/time.
- Date/time is required before route publication.
- Marks/question count are hidden until exam publish.
- Past exam list is always public, with locked details for non-enrolled users.
- Public past exam metadata shows syllabus details, date/time, live participant count, and top score with username.

## Student Signup And Auth

- One-screen signup.
- Required: name, username, phone, email, password, password confirmation.
- Username is globally unique, starts with a letter, allows letters/numbers/underscores, min length 3, and is immutable in MVP.
- Phone is Bangladesh-only, accepts `01...`, stores `+880...`, displays `01...`.
- Email is required and globally unique, but verification is skipped in MVP.
- Login accepts username, phone, or email plus password.
- Password min length is 6.
- Password reset uses teacher/admin-generated one-time reset code, expires in 1 hour, delivered manually outside platform.

## Payment And Access

- Payment collection happens outside the platform.
- Student can join a course before payment approval.
- Exams are locked until teacher approves access.
- Student submits transaction ID text.
- Teacher approves one by one.
- No online payment gateway in MVP.

## Exam Creation

- MCQ only.
- Default 50 questions / 50 minutes, configurable per exam.
- Negative marking configurable per exam.
- Answer required for every question before publish.
- Explanation optional.
- Teacher can duplicate old exams; duplicated exam counts as new exam once used/published.
- Teacher can enable/disable mock mode.
- Mock retry limit defaults to unlimited unless teacher sets a limit.

## Question Import And Metadata

- CSV import in MVP.
- XLSX later.
- Official CSV template is `docs/question-import-template.csv`.
- Tags are flat and many-to-many.
- Store subject, topic tags, previous exam/source tags, exam name, year, post name, institution, source, and reuse scope where available.
- No image-based questions or OCR/image-to-question import in MVP.

## Live Exam Attempt

- One live attempt per student per exam.
- Questions and options are always shuffled.
- Shuffled order is fixed per student attempt.
- Autosave default on and configurable.
- Answer change default allowed and configurable.
- Timer continues through internet drop.
- Exam auto-submits when time ends.
- Exam page shows connection indicator.
- Leaving/refreshing the exam page shows normal browser warning.
- Submit confirmation shows unanswered count.

## Result And Leaderboard

- Default result release is automatic 5 minutes after exam end.
- Live score and correct answers are shown after exam end by default.
- No teacher preview before release.
- No unpublish or answer correction/recalculation after release in MVP.
- Leaderboard shows name, score, and rank.
- Tied scores share rank; shorter completion time is secondary ordering/display.
- Teacher sees live results only, not mock attempt history.

## Mock Attempt

- Available only after live exam ends and result is released.
- Multiple retries allowed by default.
- Teacher can configure retry limit.
- Student sees all own mock attempts.
- Correct answers show immediately after each mock attempt.
- Mock weak-zone analytics consent is unchecked by default and controlled only by student.

## Weak-zone Report

- Student always sees own weak zones after at least one live exam.
- Weak zones update after every live exam.
- Mock attempts count only with student consent.
- Teacher can view individual weak-zone details for enrolled students.
- Admin can view all.

## Print And Export

- Teacher/admin can print exam questions.
- Bangla PDF quality and teacher/platform watermark/header are required from day one.
- Offline paper-exam result entry is not included.
- Teacher result export is not included.
- Question set CSV export is the MVP backup/export path.

## Language And Currency

- Launch UI in English.
- Build i18n structure from day one with empty Bangla placeholders.
- Admin UI stays English-only.
- Teacher/student Bangla UI is post-MVP.
- Content and PDFs must support Bangla from day one.
- Currency is BDT only.

## Technical Direction

- Backend: Hono on Cloudflare.
- Database: D1.
- KV for low-cost cache/session/ephemeral data where appropriate.
- Storage only if needed for branding assets/PDF artifacts.
- Frontend: Next.js.
- Budget guardrail: stay under 2,000 BDT/month during early validation.
- Upgrade Cloudflare paid limits if free limits fail during pilot.

## Launch Validation

- First pilot through wife's known coaching network.
- Start with Golding Coaching or Rokibul Sir.
- Offer: 500 BDT / 5 exams / 100 students.
- Founder available during first live exams.
- Track support time, exam reliability, number of paid students, and teacher willingness to run the next exam pack.
