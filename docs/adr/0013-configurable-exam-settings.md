# ADR 0013: Make Core Exam Settings Configurable Per Exam

## Status

Accepted

## Context

The product should mimic different government-job exam formats. A single fixed exam duration or result behavior would make the platform less useful across exam types and teachers.

## Decision

Core exam settings must be configurable per exam.

Initial settings:

- Number of questions.
- Duration.
- Live exam window.
- Whether late mock attempts are allowed.
- Result visibility mode.
- Correct-answer visibility mode.
- Shuffle behavior.
- Auto-submit behavior.
- Answer change policy.
- Answer autosave behavior.

Default:

- 50 questions.
- 50 minutes.
- Correct answers visible based on teacher choice: immediately after submission or after the live window ends.
- Questions and options shuffled by default.
- Exam auto-submits when time ends.
- Answer change policy is configurable.
- Answer autosave behavior is configurable.

## Consequences

Benefits:

- Supports different government-job exam patterns.
- Gives teachers control without requiring custom development.
- Keeps the product flexible for admission tests later.

Risks:

- Too many settings can confuse teachers.
- Defaults and templates will be important.

Guardrails:

- Use sensible presets.
- Keep advanced settings collapsed or secondary in the teacher panel.
