# ADR 0038: Internet Drop Does Not Pause Exam

## Status

Accepted

## Context

Many students may use mobile internet. The platform cannot reliably distinguish real connectivity issues from attempts to gain extra time. The exam should continue like a real timed exam.

## Decision

If a student's internet drops, the exam timer continues. Saved answers remain. Unsaved answers may be lost. The student is responsible for connection stability.

## Consequences

Benefits:

- Simple, fair rule.
- Prevents abuse through disconnects.
- Easier implementation.

Risks:

- Students with poor internet may be frustrated.
- Teachers may receive complaints.

Guardrails:

- Clearly warn students before exam start.
- Show a connection indicator during the exam.
- Encourage answer autosave for live exams.
