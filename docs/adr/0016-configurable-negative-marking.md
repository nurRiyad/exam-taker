# ADR 0016: Support Configurable Negative Marking Per Exam

## Status

Accepted

## Context

Different government-job exams use different negative marking rules. Some may use 0.25 per wrong answer, some may use 0.50, and some may not use negative marking.

## Decision

Negative marking is configurable per exam. Teachers can disable negative marking or set the negative value before publishing the exam.

## Consequences

Benefits:

- Better match with real government-job exam formats.
- Flexible enough for different teachers and exam categories.

Risks:

- Score calculation must be clear to students.
- Teachers may configure the wrong value by mistake.

Guardrails:

- Show the marking rule clearly before the student starts.
- Store the grading settings with each submission/result so historical results do not change if exam settings are edited later.

