# ADR 0010: Result MVP Shows Score, Rank, And Correct Answers

## Status

Accepted

## Context

Full solutions and explanations are valuable, but requiring them from day one increases teacher workload and question-entry time. The initial value is faster result checking, ranking, and correct-answer review.

## Decision

For MVP, the result page shows:

- Student score.
- Student rank.
- Correct answers.

Live leaderboard and live result are shown only after the exam ends.

Teachers can configure per exam:

- When live score is visible.
- When live correct answers are visible.
- Whether result release is automatic after exam end or manually published.

Defaults:

- Result release defaults to automatic 5 minutes after exam end.
- The 5-minute delay is fixed in MVP, not configurable per exam.
- Live score defaults to after exam end.
- Correct answers default to after exam end.

Teacher does not get a pre-release result preview in MVP.

Mock attempts show correct answers immediately after each mock attempt.

No percentile or average is shown in MVP.

Teachers cannot hide/unpublish a result after release in MVP.

Teachers cannot edit answers and recalculate released results in MVP.

Full written solutions are optional later enhancements.

## Consequences

Benefits:

- Faster exam creation.
- Lower teacher workload.
- Still solves the immediate manual result-checking problem.
- Supports teachers who want stricter live-exam control.
- Keeps live ranking hidden until the exam ends.

Tradeoffs:

- Weak students may still need teacher explanation outside the platform.
- Weak-zone analysis will rely on topic tags and answer correctness, not solution reading.
