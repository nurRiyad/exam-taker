# Relentless Interview Questions

Use this document as the running interrogation list. The goal is not to be harsh; the goal is to prevent a beautiful product from becoming a fragile business.

## Customer And Buyer

1. Name three real teachers you can sell this to in the next 30 days.
2. Are these teachers already earning from exams, or only from coaching/classes?
3. How many students does one target teacher usually have?
4. How much does a student currently pay per month or per exam?
5. Who controls the money: teacher, coaching owner, or student group admin?
6. What would make a teacher say, "I need this this week"?
7. What would make a teacher say, "Facebook/WhatsApp is enough"?

## Teacher Workflow

1. How does a teacher currently create questions?
2. Do teachers type Bangla themselves, copy from PDFs, use books, or dictate to someone?
3. Do teachers need image-based questions?
4. Are explanations written by teachers, copied from guidebooks, or usually absent?
5. How many questions are in a typical exam?
6. How long before the exam does the teacher prepare questions?
7. Does the teacher want to reuse questions across courses?
8. Who will fix mistakes in questions after students complain?

## Student Workflow

1. Does the student have reliable internet during exam time?
2. Does the student mostly use Android browser, Facebook in-app browser, or a dedicated app expectation?
3. Is login by phone number enough, or do they need passwordless OTP?
4. Will students tolerate typing a password?
5. Does rank motivate students or discourage weaker students?
6. Should students see wrong answers immediately, or only after exam is over?
7. Do students expect PDF/downloadable solutions?

## Exam Integrity

1. Is cheating a serious business problem for this market?
2. If students share questions during the exam, will teachers blame the platform?
3. Is random question order needed from day one?
4. Is random option order needed from day one?
5. Should teachers be able to hide answers until a specific time?
6. Do exams need strict start/end time, or can students take them anytime that day?

## Business Model

1. What price can a rural teacher say yes to without a meeting?
2. What price requires a demo?
3. Can you collect payment digitally from teachers?
4. Will teachers prefer to pass platform cost to students?
5. Would teachers accept a per-student fee if you show active student counts?
6. Is a one-time setup service necessary to make teachers successful?
7. What is the minimum monthly revenue per teacher that makes support worthwhile?

## Go-to-market

1. What is the first city/upazila/niche you will dominate?
2. Are you selling to BCS/job-prep teachers, school exam teachers, admission teachers, or all?
3. What teacher segment has money and pain at the same time?
4. Can one successful teacher bring three more teachers?
5. Will teachers fear that the platform exposes their student base to competitors?
6. Do teachers need public success stories before trusting you?

## Platform And Operations

1. Who creates the teacher subdomain/path?
2. Who handles support when a student cannot enter an exam?
3. What happens if 1,000 students start at exactly 8 PM?
4. What happens if Cloudflare free limits are hit?
5. How will data be backed up?
6. How will you remove a teacher who stops paying?
7. Who owns the question bank: teacher or platform?

## Legal And Trust

1. Are teachers allowed to upload questions copied from books?
2. Who is responsible for copyright complaints?
3. Can a teacher export their student list and questions?
4. What happens if a teacher demands deletion?
5. What student data is collected, and why?

## Immediate Validation Tasks

1. Interview five teachers before building the full product.
2. Ask each teacher to show the current route/exam process.
3. Watch one teacher add 20 questions using your prototype or even a spreadsheet.
4. Ask for payment before custom development.
5. Run one real scheduled exam with at least 50 students manually or semi-manually.

## Current Working Answers

- First reachable prospects: Golding Coaching and Rokibul Sir.
- First go-to-market channel: wife's known coaching network.
- Known student counts: roughly 300 students for one teacher/coaching and 80+ for another.
- First wedge: replace offline printed MCQ exam operations with digital exam delivery, ranking, result checking, averages, and weak-zone analysis.
- First content operation: platform owner helps teachers add questions, while the product also supports teacher self-entry.
- Primary product language: English-first launch UI, built so Bangla can be added easily. Admin UI stays English-only. Teacher and student UI should support Bangla later.
- I18n structure: add translation-file/i18n structure from day one, including empty Bangla placeholders. Bangla teacher/student UI is post-MVP and not a launch blocker.
- Early platform pricing hypothesis: around 500 BDT for 5 exams with up to 100 students, with later scaling by exam count and/or student count.
- Overage baseline: 100 BDT per extra 50 students, adjustable by teacher/course.
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
- Join requirement: students must log in before joining any course, including free courses.
- Payment flow: payment is outside the platform at first; teacher manually updates payment/access status.
- Access flow: students can join the course before payment, but exams are locked until teacher approval.
- Payment proof: platform supports student payment-status request with transaction ID; teacher validates manually.
- Course access persistence: approved students keep access to past course exams/results unless teacher removes them. Removing a student blocks future exams only; old results remain accessible.
- Typical exam size: around 50 MCQs.
- Typical duration: 50 minutes for 50 questions, configurable per exam to mimic real government-job exams.
- Negative marking: configurable per exam, including common values such as 0.25 or 0.50.
- Question language: roughly 70% Bangla with some English.
- Question import: CSV import is part of MVP. XLSX can come later.
- Question import validation: answer is required; explanation is optional.
- Question metadata: detailed tags from day one, including subject, exam name/type, topic, previous-exam appearance, year, post name, institution, and any other useful future-exam metadata.
- Initial taxonomy model: flat tags, not a strict tree. Questions can have many tags.
- Course structure: a course can have one or many exam topics/syllabus items; each topic can map to one exam or a series of exams. Future exam topics are visible before questions are ready, showing topic title, short description, and date/time. Date/time is required before publishing a course route. Marks/question count stay hidden until exam publish.
- Top-level subjects: Bangla, English, Math, General Knowledge, and ICT.
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
- Auth: simple password login without OTP in MVP; login accepts username, phone, or email as identifier.
- Login errors: login errors are vague for privacy/security.
- Password reset: MVP uses teacher/admin-assisted one-time reset codes sent manually outside the platform, such as through WhatsApp or phone. Both teacher and admin can generate reset codes. Codes expire after 1 hour. Automated OTP is not in MVP.
- Student account model: one student account can join multiple teachers' courses.
- Exam timing: scheduled exam window plus optional later mock attempt with separate ranking.
- Attempt policy: live exam allows one attempt only; live attempts are not reset/reopened in MVP. Teacher can enable/disable mock mode per exam. Mock exams allow teacher-configured retry limits.
- Mock availability: live exam questions become available for mock only after the live exam ends and result is released.
- Mock results: students see all mock attempts, and correct answers show immediately after each mock attempt.
- Exam timeout: exam auto-submits when time ends.
- Answer changes: configurable by teacher before exam; default is allowed.
- Answer autosave: configurable per exam; default is on.
- Internet drop: timer continues; saved answers remain; unsaved answers may be lost. Student is responsible for connection stability.
- Connection indicator: exam page should show online/offline connection status.
- Leave/refresh warning: exam page warns before browser refresh, close, or leaving the exam page, while normal previous/next question navigation remains available.
- Submit confirmation: students see unanswered question count before final submit, and submission requires confirmation if unanswered questions remain.
- Shuffle: live exam questions and options are always shuffled. The shuffled order is fixed per student attempt.
- Result MVP: score, rank, full named leaderboard, and correct answers. Live leaderboard appears only after exam ends. Teacher configures per exam when live score/correct answers appear and whether result release is automatic or manual. Defaults: automatic release 5 minutes after exam end, live score after exam end, correct answers after exam end. No percentile/average in MVP. Full solutions come later.
- Leaderboard display: name, score, and rank only. Tied scores share rank, with shorter completion time used as secondary ordering/display.
- Print/export: teachers should be able to print exam questions for offline exams, but offline result data is not tracked for now.
- Print/export quality: Bangla PDF must be good from day one and include teacher/platform watermark or header.
- Admin support: read-only support in MVP; no admin impersonation.
- Payment approval: teacher approves payment/access requests one by one in MVP.
- Weak-zone report: students always see weak zones, updated after every live exam. Mock attempts are included only if the student checks consent before starting the mock.
- Mock analytics consent: unchecked by default.
- Mock analytics consent control: only student controls the decision; teacher can view but not edit.
- Weak-zone visibility: student sees only self; teacher sees students joined to the teacher's courses; admin sees all.
- Teacher weak-zone view: individual student details only in MVP.
- Teacher mock visibility: teacher sees only live exam result in MVP, not student mock attempt history.
- Result unpublish: teacher cannot hide/unpublish result after release in MVP.
- Result correction: teacher cannot edit answers and recalculate released results in MVP.
- Result preview: teacher does not get a pre-release preview in MVP.
- Copyright/content terms: teacher confirms once per account that questions are open/source-safe or owned/authorized by them.
- Question answer model: each exam question stores its answer and optional explanation.
- Publish validation: system blocks publishing an exam unless every question has an answer.
- Official import template: one CSV template should be provided from day one.
- Backup/export policy: no full backup policy for MVP; question sets should be exportable as CSV.
- Budget guardrail: do not spend more than 2,000 BDT/month during early validation. If Cloudflare free limits are hit during pilot, upgrade to paid limits.
- Pilot support: founder will be available during first live teacher exams.
- First paid offer: start from 500 BDT / 5 exams / 100 students, but can change after teacher conversation.
- Exam duplication: teachers can duplicate old exams, and duplicated exams count as new exams for exam-pack/billing once used/published.
- Question bank ownership: platform can reuse questions by default, but a teacher can request teacher-private questions that are not reused for others. Teacher-private questions do not cost extra in MVP.
- Teacher export: teachers cannot export all student results to CSV/XLSX in MVP.
- Admin export: platform admin CSV/XLSX export can come later, not in initial release.
- Account deletion: students cannot self-delete in MVP; admin can archive/deactivate/delete accounts.
- Question images: no image-to-question extraction and no image-based MCQs in initial release.
- Teacher announcements/messages: not included in MVP.
- Teacher branding: teacher page supports logo, banner, color, and user/teacher picture using a common template customized per teacher.
- Teacher deployment model: initial pilots may use separate teacher-specific code/deployments generated from a common template for speed.
- Past exam visibility: past exam list is visible publicly, but results/details are locked for non-enrolled users.
- Public past exam metadata: public past exam list shows full syllabus details, live participant count based on students who started the live attempt, and top score. Top score is always public and shows marks plus required username.
- Locked exam CTA: non-enrolled users see exact price plus payment/join instructions on locked past exams.
- First market wedge: BCS and government-job preparation, with admission tests later.
- Reliability risk: if a live exam fails, both the teacher and the platform lose trust.

## Remaining Questions

No blocking MVP discovery questions remain.

Questions to revisit after the first paid pilot:

1. Should teacher email communication be sent from the platform or stay manual longer?
2. Does the 500 BDT / 5 exams / 100 students offer cover support time and reliability expectations?
3. Which flat tags are actually used by teachers and which should be removed from the official template?
4. Should early separate teacher deployments be merged into one multi-tenant deployment before the third teacher?
5. What paid Cloudflare plan or data backup policy is needed once live exam volume becomes predictable?
