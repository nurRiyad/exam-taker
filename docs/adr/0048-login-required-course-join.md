# ADR 0048: Require Login Before Joining Any Course

## Status

Accepted

## Context

Courses can be paid or free. Even for free courses, the platform needs a student identity for exam attempts, ranking, weak-zone reports, and teacher controls.

## Decision

Students must log in before joining any course, including free courses.

Free courses auto-approve join requests after login, but teachers can still block/remove students.

Free courses do not provide public preview before login in MVP.

## Consequences

Benefits:

- Ensures every attempt has a student account.
- Supports rankings and weak-zone analytics.
- Lets teachers remove/block students even in free courses.

Tradeoffs:

- Anonymous free-course joining is not supported.
