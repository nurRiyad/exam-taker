# ADR 0037: Make Answer Change And Autosave Configurable Per Exam

## Status

Accepted

## Context

Teachers may want different exam behavior. Some exams should allow students to change answers before final submit. Some may want answers saved immediately after selection to reduce loss during weak connections.

## Decision

Answer change behavior and answer autosave behavior are configurable per exam.

Defaults:

- Answer changing is allowed.
- Answer autosave is on.

## Consequences

Benefits:

- Flexible for different teacher preferences.
- Autosave can reduce data loss.
- Answer-change policy can mimic stricter exam formats.

Risks:

- Too many settings may confuse teachers.
- If autosave is off, students may lose unsaved answers during connection loss.

Guardrails:

- Show the exam rules before the student starts.
- Make the selected settings visible in teacher exam setup.
