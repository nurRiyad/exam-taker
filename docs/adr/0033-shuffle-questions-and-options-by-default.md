# ADR 0033: Shuffle Questions And Options By Default

## Status

Accepted

## Context

Live online MCQ exams have cheating and answer-sharing risk. Shuffling questions and options does not fully prevent cheating, but it raises friction and is expected behavior for online exams.

## Decision

Live exams always shuffle both question order and option order. The shuffled order is stored per student attempt and remains stable after the attempt starts.

## Consequences

Benefits:

- Reduces simple answer sharing.
- Makes online exams feel more robust.

Risks:

- Result review must show the student's selected answer correctly even if options were shuffled.
- Refreshing the page must not create a new random order.

Guardrails:

- Store the question and option order shown to each student attempt.
- Keep the order stable after an attempt starts.
