# ADR 0024: Platform-reusable Questions By Default With Teacher-private Override

## Status

Accepted (status corrected from a stale "Proposed" — formalized further by [ADR-0055](0055-shared-question-bank-with-exam-links.md), which is Accepted).

## Context

The founder wants the platform to own/reuse questions by default, while allowing exceptions when a teacher insists that specific questions are private. This can improve platform value over time, but mishandling it can damage teacher trust.

## Decision

Questions are reusable by the platform by default. A teacher can request or require specific questions to be marked teacher-private, in which case those questions should not be reused for other teachers.

Teacher-private questions do not cost extra in MVP; they are a setting by agreement.

## Consequences

Benefits:

- Builds long-term platform question-bank value.
- Allows reuse across teachers and exams.
- Gives teachers a trust-preserving private option.

Risks:

- Teachers may object if reuse expectations are unclear.
- Copyright/source issues may arise if questions are copied from books or other materials.

Guardrails:

- Make ownership/reuse terms explicit before paid pilots.
- Store a reuse scope on questions: platform-reusable or teacher-private.
- Track source details where possible.
