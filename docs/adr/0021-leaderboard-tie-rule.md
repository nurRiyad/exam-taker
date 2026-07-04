# ADR 0021: Use Shared Rank For Tied Scores With Time As Secondary Ordering

## Status

Accepted

## Context

Students may receive the same score. Ranking needs to feel fair while still giving competitive signal.

## Decision

Students with the same score share the same rank. Within the tied rank, shorter completion time can be used as secondary ordering or display.

## Consequences

Benefits:

- Same marks receive the same rank, which feels fair.
- Completion time still creates useful distinction.

Guardrails:

- Leaderboard should show only name, score, and rank in MVP.
- Phone and email must not appear on the public leaderboard.

