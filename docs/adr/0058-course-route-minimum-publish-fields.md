# ADR 0058: Minimum Fields To Publish A Course Route

## Status

Accepted

## Context

ADR-0046 modeled course routes as exam topics but left an open detail: the exact minimum fields required before a course route can be published and shown to students.

## Decision

A course can be published (its route made publicly visible) once:

- The course itself has: `title`, `short_description`, and a price/free status set (`is_free` or `base_price_bdt`).
- At least one `Exam Topic` exists under the course, and every `Exam Topic` intended to be visible has: `title`, `short_description`, and `scheduled_at` (date/time) set, matching the existing rule that date/time is required before a future topic is shown (ADR-0046, `docs/mvp-spec.md`).

Marks/question count remain hidden per exam topic until that specific exam is published (ADR-0046, unchanged).

A course with zero exam topics cannot be published, since a route with no planned topics has nothing to show students.

## Consequences

Benefits:

- Closes the open detail in ADR-0046 with a rule that matches what was already stated for individual future topics.
- Gives the teacher UI a concrete, checkable publish-validation rule (similar in spirit to ADR-0030's exam-answer publish check).

Tradeoffs:

- A teacher cannot publish a course "shell" with no planned topics yet to reserve a page; they must define at least one dated topic first. Considered acceptable since an empty route provides no student value.
