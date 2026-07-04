# ADR 0005: Use Next.js For Frontend

## Status

Proposed

## Context

The planned frontend is Next.js. The product needs teacher admin pages, public teacher pages, student course pages, and mobile-first exam experiences.

## Decision

Use Next.js for the frontend, with a strict performance budget for student exam pages.

## Consequences

Benefits:

- Fast development.
- Strong routing model.
- Good ecosystem for admin dashboards and public pages.

Risks:

- It is easy to overbuild heavy client pages.
- Next.js hosting choices need to fit the Cloudflare backend plan.

Guardrails:

- Keep exam pages simple and lightweight.
- Avoid unnecessary client-side libraries in the student exam flow.
- Separate public/student experience from heavier teacher admin views where useful.

