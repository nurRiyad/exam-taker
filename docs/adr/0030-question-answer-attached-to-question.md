# ADR 0030: Attach Answer And Optional Explanation To Each Exam Question

## Status

Accepted

## Context

Each exam question needs a correct answer for scoring and result review. Explanations are useful but not required for MVP.

## Decision

Each exam question stores its correct answer. Explanation is attached to the question as an optional field.

## Consequences

Benefits:

- Simple scoring model.
- Correct answers can be shown in result review.
- Explanations can be added later without changing the question model.

Guardrails:

- Answer is required for published exams.
- The system blocks publishing unless every question has an answer.
- Explanation should be optional in MVP.
