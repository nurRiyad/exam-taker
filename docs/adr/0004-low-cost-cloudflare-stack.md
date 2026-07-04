# ADR 0004: Use Low-cost Cloudflare Stack For MVP Backend

## Status

Proposed

## Context

The current preferred backend stack is Hono with Cloudflare D1, KV, and storage if needed. The business wants to start with free or low-cost plans and upgrade only after revenue.

## Decision

Use Hono on Cloudflare Workers for API/backend logic, D1 for relational data, KV for low-risk cached/config data, and object storage only when files/images become necessary.

## Consequences

Benefits:

- Very low starting cost.
- Globally available edge deployment.
- Hono fits Workers well.
- D1 can model teachers, courses, exams, submissions, and billing records.

Risks:

- D1 behavior and limits must be tested for scheduled high-concurrency exams.
- KV is eventually consistent, so it must not be used as the source of truth for exam submissions or payments.
- Free-tier constraints may become a product risk during live exams.

Engineering guardrails:

- Store exam submissions in D1, not KV.
- Use idempotent answer save and final submit endpoints.
- Track exam traffic assumptions before promising large live exams.
- Build an export/backup path early.

