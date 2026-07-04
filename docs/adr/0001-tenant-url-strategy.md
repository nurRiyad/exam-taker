# ADR 0001: Start With Template-based Teacher Deployments For First Pilots

## Status

Superseded by [ADR-0052](0052-single-shared-multi-tenant-deployment.md). The platform now uses one shared multi-tenant deployment from day one instead of per-teacher template deployments; this ADR is kept for history only.

## Context

The platform needs to give each teacher a branded public presence. Options include:

- Path-based pages, such as `teacing.com/habib-sir`.
- Subdomains, such as `habib-sir.teacing.com`.
- Separate deployments per teacher.

The plan needs to stay cheap and operationally simple while validating whether teachers will pay. The founder is willing to create teacher-specific code/deployments from a common template during early pilots if it is faster.

## Decision

For first pilots, allow teacher-specific pages/deployments generated from a common code template. Keep the longer-term data model tenant-aware so a shared multi-tenant platform can replace this when validation is proven.

## Consequences

Benefits:

- Fast teacher-specific customization.
- Supports logo, banner, color, and teacher picture per teacher.
- Fits manual early sales and support.
- Lets the founder move before a full multi-tenant SaaS shell is built.

Tradeoffs:

- Separate deployments can become operationally messy.
- Harder to aggregate analytics and maintain changes across teachers.
- Needs a later migration path to shared tenancy.

Follow-up:

- Move to shared path/subdomain tenancy after pilot validation.
- Keep template conventions tight so changes can be copied safely across teacher deployments.
