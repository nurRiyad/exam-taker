# ADR 0051: Early Validation Budget And Cloudflare Upgrade Policy

## Status

Accepted

## Context

The business should validate demand without overspending. The founder wants to avoid spending more than 2,000 BDT/month during early validation, but live exams must remain reliable.

## Decision

Keep early monthly spend under 2,000 BDT where possible. If Cloudflare free limits are hit during a pilot, upgrade to paid limits rather than letting a live exam fail.

## Consequences

Benefits:

- Keeps burn low.
- Prioritizes live exam reliability.

Risks:

- Paid upgrades may happen before revenue is stable.

Guardrails:

- Cap first pilot sizes.
- Track incidents and cost per live exam.

