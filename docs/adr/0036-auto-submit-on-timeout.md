# ADR 0036: Auto-submit Exam When Time Ends

## Status

Accepted

## Context

Timed exams need deterministic end behavior. If students can continue after time expires, the exam no longer mimics real government-job exam conditions.

## Decision

When exam time ends, the attempt auto-submits.

## Consequences

Benefits:

- Clear and fair exam ending.
- Matches real timed exam expectations.
- Reduces teacher disputes.

Risks:

- If a student has connection issues near the end, only saved answers may be submitted.

Guardrails:

- Show a clear timer.
- Warn near the end of exam.
- Save answers according to the exam's autosave setting.

