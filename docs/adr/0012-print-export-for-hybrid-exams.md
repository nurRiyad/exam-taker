# ADR 0012: Support Print Export As A Hybrid Adoption Bridge

## Status

Accepted (status corrected from a stale "Proposed" — the direction this ADR sets is depended on by [ADR-0057](0057-print-pdf-without-headless-browser.md), which is itself Accepted; print/export lands in Step 10 of `docs/build-plan.md`, not yet built).

## Context

Even if the platform replaces online exam delivery, teachers may still want to run some paper exams. Since questions are already entered into the platform, printable output creates extra value and reduces adoption resistance.

## Decision

Support teacher-facing print/export for exam questions. Offline paper-exam submissions and scores are not tracked in MVP.

## Consequences

Benefits:

- Helps teachers use the platform even when not all students take online exams.
- Makes question entry more valuable.
- Reduces fear of losing the existing offline workflow.

Tradeoffs:

- Requires acceptable Bangla print layout quality.
- Could keep teachers attached to offline exams instead of fully online workflows.
- Offline result analytics will be incomplete unless a later manual score-entry feature is added.

Likely MVP print options:

- Question paper.
- Answer key, preferably separate or teacher-only.

