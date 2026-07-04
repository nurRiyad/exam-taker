# ADR 0060: Frontend Hosting And Cross-subdomain Cookie Auth

## Status

Accepted. Resolves the open follow-up in [ADR-0054](0054-jwt-auth-with-pbkdf2-password-hashing.md).

## Context

ADR-0054 assumed the frontend and API are served from the same top-level site so the JWT cookie can be httpOnly/Secure without CORS/credential complexity, and left the exact hosting topology as a follow-up until Next.js hosting was chosen. ADR-0052 already committed to one shared multi-tenant deployment (not per-teacher); this decision is about how the two apps (`apps/api`, `apps/web`) are hosted, not about per-tenant infrastructure, and does not conflict with it.

## Decision

- Host `apps/web` (Next.js) on Cloudflare via the OpenNext Cloudflare adapter (`@opennextjs/cloudflare`), the current supported path for running Next.js on Cloudflare Pages/Workers (superseding the deprecated `@cloudflare/next-on-pages`). This keeps both apps on the same platform and billing account, consistent with the budget guardrail (ADR-0051).
- Host `apps/api` (Hono) as its own Cloudflare Worker.
- Use one registrable domain with a subdomain split: the frontend on the apex/`www` (for example `examtaker.com`), the API on `api.examtaker.com`. The exact domain name is a business decision outside this ADR's scope.
- Issue the auth cookie (ADR-0054) with `Domain=.examtaker.com` (the parent registrable domain) so it is sent to both the frontend and API subdomains as same-site, with `Secure`, `httpOnly`, and `SameSite=Lax`.
- In local development, proxy API calls through the Next.js dev server (`next.config` rewrites forwarding `/api/*` to the local Wrangler dev server) so the browser sees same-origin requests in dev too, keeping cookie behavior consistent between local and production instead of needing separate dev-only CORS handling.

## Consequences

Benefits:

- Resolves ADR-0054's open follow-up with a concrete, low-cost topology.
- Same-site cookie auth works in both environments without CORS credential workarounds.
- Both apps deploy independently (separate Wrangler/Pages projects) while staying under one domain and one Cloudflare account.

Tradeoffs:

- Requires DNS/zone setup on the chosen domain before either environment is fully production-like; local dev is unaffected since it proxies instead of using real subdomains.
- `SameSite=Lax` (not `Strict`) is required for the cookie to survive top-level navigations between the apex and `api.` subdomain in some cases; accepted as a standard tradeoff for this pattern, not a meaningful security gap for this app's threat model.

## Follow-up

Confirm actual domain choice before Step 2 of `docs/build-plan.md` finalizes DNS/zone setup and `wrangler.jsonc` route bindings.
