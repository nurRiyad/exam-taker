# ADR 0002: Mobile-first Exam Experience

## Status

Accepted

## Context

The expected student base will mostly use mobile phones. Some may use low-end Android devices, slow internet, and Facebook in-app browsers.

## Decision

Design the student experience mobile-first from day one. Desktop should work, but mobile exam-taking is the primary workflow.

## Consequences

Product requirements:

- Large tappable answer options.
- Fast loading pages.
- Minimal typing during exams.
- Clear timer and question progress.
- Resilient submission behavior for weak connections.
- Simple login flow.

Technical implications:

- Keep the exam page lightweight.
- Avoid heavy client-side dependencies in the exam-taking route.
- Save answers progressively when possible.
- Make final submission idempotent.

