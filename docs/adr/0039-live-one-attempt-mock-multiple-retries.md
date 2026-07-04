# ADR 0039: One Live Attempt, Multiple Mock Retries

## Status

Accepted

## Context

Live exams should mimic official timed exams and produce a fair leaderboard. Mock exams are for practice and should be more forgiving.

## Decision

Each student gets one live attempt per exam. Live attempts are not reset or reopened in MVP. Teachers can enable/disable mock mode per exam. Mock exams allow teacher-configured retry limits.

Students can see all mock attempts.

Teachers see only live exam results in MVP, not student mock attempt history.

## Consequences

Benefits:

- Keeps live ranking fair.
- Lets students practice after the official exam.
- Separates official performance from practice behavior.

Risks:

- Students may ask for reset/reopen after technical complaints, but MVP does not support it.

Future:

- Add teacher/admin controlled attempt reset if pilot support shows it is truly needed.
