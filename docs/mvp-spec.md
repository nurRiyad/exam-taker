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
- All teachers use the shared multi-tenant platform, with branding and data scoped to each teacher's tenant.
- Each teacher's public storefront lists that teacher's courses with title, short description, student-facing price/free status, discount, and exam route summary.
- Global teacher/course directories are admin/support pages, not student marketplace pages.
- Teachers can view and manage only their own tenant's courses, batches, exams, and enrolled students. Students can view their own memberships, attempts, results, and progress. Admins can access platform-wide records and support views.

## Course

- Course-level price only; no per-exam price in MVP.
- Free courses allowed.
- Discount is percentage-only with start/end date.
- Enrolled students keep their paid price.
- Free course join is auto-approved after login.
- Teacher can block/remove students from future access.

## Course Batches, Routes, And Exam Topics

- A course can have one or many batches. A batch groups its student cohort, syllabus, and schedule; a batch contains one or more scheduled exam topics.
- Future exam topics are visible on the owning teacher's public storefront before questions are ready.
- Future topic fields: title, short description, date/time.
- Date/time is required before route publication.
- Marks/question count are hidden until exam publish.
- Past exam list is public on the teacher's storefront, with locked details for non-enrolled users.
- Public past exam metadata shows syllabus details, date/time, live participant count, and top score with username, subject to the exam's configured result visibility.

## Student Signup And Auth

- One-screen signup.
- Admin and teacher accounts are global. Each teacher account owns exactly one teacher page.
- Student accounts are scoped to one teacher page. A student can have separate accounts on multiple teacher pages; each account works across all courses, batches, and exams on that page.
- Signup requires email, Bangladesh phone, password, and password confirmation. Student signup also carries the teacher page context; teacher signup chooses a unique page slug.
- Email and phone are unique globally for admin/teacher accounts and unique per teacher page for students.
- Phone is Bangladesh-only, accepts `01...`, stores `+880...`, displays `01...`.
- Email verification is skipped in MVP.
- Login accepts email or phone plus password. Student login resolves the account within the teacher page in the URL.
- Password length is 5–20 characters.
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

- Launch UI is Bangla-first across public, student, teacher, and admin pages.
- Keep user-facing copy and locale-sensitive formatting easy to adapt to English later; do not add English UI unless requested.
- Content and PDFs must support Bangla from day one.
- Currency is BDT only.

## Technical Direction

- Backend: Hono on Cloudflare.
- Database: D1, accessed via Drizzle ORM (not Prisma or raw-only), migrations authored via `drizzle-kit generate` and applied via Wrangler.
- Validation: Zod, with `drizzle-zod` deriving schemas from DB tables.
- KV for low-cost cache/session/ephemeral data where appropriate.
- Storage only if needed for branding assets/PDF artifacts.
- Frontend: Next.js, Tailwind CSS + shadcn/ui, mobile-first as the default design posture across the whole product, not just the exam page.
- Hosting: frontend on Vercel, API as a Cloudflare Worker, each on its platform's free default domain for now — no custom domain yet.
- Auth transport: JWT as a bearer token (`Authorization: Bearer`), not an httpOnly cookie, since frontend and API are on different registrable domains.
- Budget guardrail: stay under 2,000 BDT/month during early validation.
- Upgrade Cloudflare paid limits if free limits fail during pilot.
- Full detail: `docs/ARCHITECTURE.md`.

## Launch Validation

- First pilot through wife's known coaching network.
- Start with Golding Coaching or Rokibul Sir.
- Agree the per-student billing rate for each course with the teacher before the pilot; admin invoices manually from the approved/enrolled student count.
- Founder available during first live exams.
- Track support time, exam reliability, approved students, and teacher willingness to continue using the platform.
