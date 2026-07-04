# ADR 0011: Let Students Join Courses Before Payment Approval, But Lock Exams

## Status

Accepted

## Context

Students may discover or join a course before their payment has been verified by the teacher. Blocking course join entirely would make the payment/request flow harder, but allowing unpaid exam access breaks the teacher's business.

## Decision

Students can join a course before payment approval, but paid exams remain locked until the teacher approves access.

Approved students keep access to past course exams/results unless the teacher removes them. Removing a student blocks future exams only; old results remain accessible.

## Consequences

Benefits:

- Students can enter the course and understand what is available.
- The platform can show a clear payment/access request path.
- Teacher keeps control over paid exam access.

Required MVP states:

- Joined but unpaid/pending.
- Payment requested.
- Approved.
- Blocked or rejected.
- Removed.

Risks:

- Students may repeatedly ask for approval before teacher checks payment.
- Teacher needs a simple pending-request queue.
