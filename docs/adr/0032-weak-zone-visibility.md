# ADR 0032: Weak-zone Visibility By Relationship

## Status

Accepted

## Context

Weak-zone reports are student performance analytics. They are valuable for teachers, but visibility must be scoped so one teacher cannot see students outside their courses.

## Decision

Weak-zone visibility follows the relationship:

- Students see only their own reports.
- Teachers see reports only for students joined to that teacher's courses.
- Platform admins can see all reports.

## Consequences

Benefits:

- Useful for teacher coaching.
- Preserves privacy across tenants.
- Supports global student accounts across multiple teachers.

Risks:

- Teachers may expect broader access if students join multiple teachers.

Guardrails:

- Every teacher analytics query must be scoped by teacher/course enrollment.
- Admin access should be audited later.

