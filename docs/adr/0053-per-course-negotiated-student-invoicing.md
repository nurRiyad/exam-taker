# ADR 0053: Per-course Negotiated Student-count Invoicing

## Status

Accepted (supersedes ADR-0006's pricing unit, and the billing-count clause of ADR-0023)

## Context

ADR-0006 proposed exam-pack pricing (for example 500 BDT for 5 exams) as the MVP billing unit, with ADR-0023 counting duplicated-and-published exams against that pack. In practice, the founder wants to bill per course: a teacher may run several courses, each with a different negotiated rate depending on how many students are enrolled in that course, and receive one invoice per course rather than a running exam-pack usage counter.

Note: this billing rate is the platform's private rate charged to the teacher. It is unrelated to `Course.base_price_bdt`, which is the student-facing price the teacher charges their own students.

## Decision

Replace exam-pack usage billing with per-course, negotiated, student-count-based invoicing:

- Each course has an admin-set negotiated rate: `price_per_student_bdt`, agreed between the platform and the teacher for that specific course.
- Admin manually generates an invoice for a course. At generation time, the platform snapshots the course's current approved-student count and the negotiated rate, and computes `amount_bdt = approved_student_count_snapshot x price_per_student_bdt_snapshot`, with a manual override field on the invoice for one-off negotiated adjustments.
- One invoice belongs to exactly one course and one tenant (teacher).
- Invoicing is manually triggered by admin in MVP. No automatic recurring billing, no automatic dunning. This matches the existing pattern of admin-managed payment status (ADR-0008) rather than adding billing automation.
- Invoice lifecycle: `draft -> sent -> paid`, or `void`. Tracked manually by admin, the same way teachers manually track student payment access requests.
- Exam count no longer gates billing or access. Exam duplication (ADR-0023) still counts a duplicated-and-published exam as a distinct exam for reporting purposes, but it no longer drives a pack-usage limit.

## Consequences

Benefits:

- Matches how the founder actually negotiates with teachers: per course, per student count.
- No need to build exam-pack usage-limit enforcement logic that would otherwise gate exam publishing.
- Resolves the previously open "Active Student" billing definition from the glossary: the billing unit is now "approved students enrolled in a course at invoice time," not an ambiguous cross-course concept.

Tradeoffs:

- Revenue is no longer tied to platform load (exam count, live-attempt traffic) as directly as exam-pack pricing was.
- No automatic mechanism blocks a teacher from running unlimited exams on an unpaid course in MVP; this is an accepted early-pilot trust tradeoff, consistent with the founder doing hands-on onboarding and support during pilots.
- Needs admin discipline to actually generate and send invoices, since there is no usage cap forcing the moment of billing.

## Follow-up

- Revisit whether course access should soft-lock (for example, block publishing new exams) if the most recent invoice for a course is unpaid past a grace period. Defer until real pilot invoicing data exists.
- `docs/pilot-terms.md` and `docs/product-brief.md` pricing language (500 BDT / 5 exams / 100 students) should be treated as the historical pilot offer, not the live billing mechanism; update those docs' framing once the first real invoice is generated.

## Supersedes

- ADR-0006: the exam-pack pricing *unit* is replaced. The general instinct behind ADR-0006 (test simple, teacher-legible pricing before a rigid subscription) still holds.
- ADR-0023: the clause that duplicated-and-published exams count against an exam-pack limit no longer applies, because there is no exam-pack limit. The rest of ADR-0023 (teachers can duplicate old exams) stands.
