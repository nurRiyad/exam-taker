# ADR 0040: Warn Before Refreshing, Closing, Or Leaving Exam Page

## Status

Accepted

## Context

Students may accidentally refresh, close, or navigate away during a live exam. The exam should still allow normal previous/next question navigation inside the exam.

## Decision

The exam page should warn before browser refresh, close, or leaving the exam page. Normal navigation between exam questions remains available.

## Consequences

Benefits:

- Reduces accidental attempt disruption.
- Makes internet/drop rules clearer to students.

Tradeoffs:

- Browser warnings can be limited by browser behavior.

Guardrails:

- Do not block normal previous/next question navigation.
- Pair warnings with autosave default-on.

