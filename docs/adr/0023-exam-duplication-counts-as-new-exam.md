# ADR 0023: Allow Exam Duplication, Count Published Copies As New Exams

## Status

Accepted. The exam-pack billing clause below is superseded by [ADR-0053](0053-per-course-negotiated-student-invoicing.md): billing is now per-course/student-count, not per-exam-pack, so duplicated exams no longer count against a pack limit. The decision to allow exam duplication itself is unaffected and remains accepted.

## Context

Teachers often run similar exams or want to reuse a previous structure. Copying an old exam will make exam creation faster. The original context assumed the business model charged by exam pack, which is no longer the billing mechanism (see ADR-0053), but duplication is still useful on its own merits.

## Decision

Teachers can duplicate old exams. (Historical: a duplicated exam counted as a new exam for exam-pack usage once published or used with students — no longer applicable under ADR-0053.)

## Consequences

Benefits:

- Faster teacher workflow.
- Encourages reuse of route, settings, and question structure.

Risks:

- Teachers may be confused if drafts do not count but published copies do.

Guardrails:

- Draft duplicated exams should not count until published/used. (Historical, tied to the superseded exam-pack model.)
- The teacher panel should show course invoicing status clearly (ADR-0053), not exam-pack usage.

