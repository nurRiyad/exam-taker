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

Moved to avoid drift between duplicate copies — see `docs/product-brief.md` (market/business framing) and `docs/mvp-spec.md` (feature-area defaults), or the specific ADR under `docs/adr/` for anything decision-level.

## Remaining Questions

No blocking MVP discovery questions remain.

Questions to revisit after the first paid pilot:

1. Should teacher email communication be sent from the platform or stay manual longer?
2. Does the 500 BDT / 5 exams / 100 students offer cover support time and reliability expectations?
3. Which flat tags are actually used by teachers and which should be removed from the official template?
4. Should early separate teacher deployments be merged into one multi-tenant deployment before the third teacher?
5. What paid Cloudflare plan or data backup policy is needed once live exam volume becomes predictable?
