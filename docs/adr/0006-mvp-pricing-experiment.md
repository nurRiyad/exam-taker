# ADR 0006: Test Exam-pack Pricing Before Subscription Pricing

## Status

Partially superseded by [ADR-0053](0053-per-course-negotiated-student-invoicing.md). The platform-to-teacher billing *unit* (exam-pack usage) described below no longer applies; billing is now per-course, negotiated-rate, student-count-based invoicing. The student-facing pricing rules in this ADR (course-level pricing, free courses, discounts, enrolled-price lock, BDT-only) are unaffected and remain accepted.

## Context

The first target teachers are price-sensitive and already think in terms of exams, not software subscriptions. The current pricing idea is around 500 BDT for 5 exams, with future pricing depending on student count or additional exams.

## Decision

For the first pilot, sell exam packs instead of a monthly SaaS subscription.

Example platform pilot offer:

- 500 BDT for 5 exams.
- Up to 100 students included.
- 100 BDT per extra 50 students as a baseline overage.
- Manual setup help included.
- Limited to an agreed number of students per exam until infrastructure and support costs are measured.

Student-facing pricing is course-level in MVP. Individual exam topics do not have separate student-facing prices. Course price is visible publicly on the teacher page. Courses can also be free.

Courses can show percentage discounts, such as 30% off. Discounts have start and end dates and apply automatically by date. Discounts only affect new unenrolled students. Enrolled students keep the price they paid. Base course price is not edited after students join in MVP.

Free courses are allowed and auto-approve student join requests, but teachers can still block/remove students. MVP supports BDT only.

## Consequences

Benefits:

- Easy for teachers to understand.
- Maps directly to the offline exam-printing replacement.
- Lower commitment for early buyers.
- Helps validate willingness to pay before building billing complexity.

Risks:

- Revenue may be too low if support is heavy.
- Large teachers with 300+ students may create more load than the price supports.
- Teachers may anchor future expectations to the low pilot price.
- Custom pricing by teacher/exam can become confusing if not tracked clearly.
- Changing course prices after students join can create payment disputes.

Follow-up:

- Track support minutes per exam.
- Track active students per exam.
- Track platform incidents during live exam windows.
- Reprice after 2-3 real pilots based on actual economics.
- Validate whether 100 BDT per extra 50 students covers support and infrastructure.
