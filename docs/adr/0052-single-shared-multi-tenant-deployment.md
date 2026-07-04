# ADR 0052: Single Shared Multi-tenant Deployment

## Status

Accepted (supersedes ADR-0001)

## Context

ADR-0001 proposed generating separate teacher-specific code deployments from a shared template during early pilots, with a later migration to shared tenancy. In practice, the data model was already built tenant-aware (`Tenant`, `tenant_id` across Course/Exam/etc.), and global student accounts (ADR-0017) require one student account to join multiple teachers' courses. Separate deployments would mean separate databases, which breaks a single student account working across teachers and breaks any cross-tenant admin view. Running and patching N deployments is also more operational overhead than one shared app for a small/solo team.

## Decision

Build one shared multi-tenant deployment from day one. All teachers (tenants) live in the same D1 database and the same Hono/Next.js app, scoped by `tenant_id`. No per-teacher forked deployments, not even for the first pilots.

Teacher pages are path-based under one domain for MVP, for example `platformdomain.com/habib-sir`. Subdomain-per-teacher can be considered later if branding expectations require it.

## Consequences

Benefits:

- One codebase and one CI/CD pipeline.
- Matches the existing tenant-aware data model instead of fighting it.
- Global student accounts and cross-tenant admin support work without extra plumbing.
- Simpler cost tracking against the early budget guardrail (ADR-0051): one Worker, one D1 instance.

Tradeoffs:

- Less deep visual/behavioral customization per teacher at launch; branding stays limited to the fields already modeled (logo, banner, color, teacher picture).
- A bug in a shared path (auth, exam attempt flow) affects every tenant at once, so shared paths need solid coverage before rollout.
- Every query that touches teacher or student data must be scoped by `tenant_id`/course membership; this is now a hard security requirement, not a nice-to-have (reinforces ADR-0032).

## Supersedes

ADR-0001. That ADR's decision to use template-based per-teacher deployments no longer applies.
