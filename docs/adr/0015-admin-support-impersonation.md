# ADR 0015: Use Read-only Admin Support In MVP

## Status

Accepted

## Context

The platform owner may need to support teachers directly, including helping with question entry, printing exams, and debugging student access. Acting as a teacher or student can make support faster but creates trust and audit risks.

## Decision

For MVP, admin support is read-only. Admin impersonation is not included.

## Consequences

Benefits:

- Lower trust and privacy risk.
- Simpler audit model.
- Avoids accidental admin-caused changes being blamed on teachers/students.

Risks:

- Some support actions may require teacher/student cooperation.
- Admin cannot directly fix every issue from inside another user's session.

Guardrails:

- Revisit impersonation only after audit logging exists.
