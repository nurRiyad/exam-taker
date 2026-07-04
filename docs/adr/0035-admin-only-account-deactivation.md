# ADR 0035: Admin-only Account Archive/Deactivate/Delete In MVP

## Status

Accepted

## Context

Student self-deletion introduces account recovery, audit, enrollment, result history, and teacher reporting questions. The initial release can keep this manual.

## Decision

Students cannot self-delete accounts in MVP. Platform admin can archive, deactivate, or delete accounts.

## Consequences

Benefits:

- Simpler MVP.
- Prevents accidental student data loss.
- Keeps result history stable during pilots.

Risks:

- Manual support required for deletion requests.
- Privacy expectations may evolve.

Future:

- Add student-requested account deletion workflow when policy and data-retention rules are clearer.

