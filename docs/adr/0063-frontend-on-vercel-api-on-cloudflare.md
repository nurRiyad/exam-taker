# ADR 0063: Frontend On Vercel, API Stays On Cloudflare

## Status

Accepted. Supersedes [ADR-0060](0060-frontend-hosting-and-cookie-domain.md)'s frontend-hosting decision. Domain topology below reflects the decision to ship on free default domains rather than a custom domain; see [ADR-0064](0064-bearer-token-auth-default-domains.md) for the resulting auth-transport change (bearer token instead of ADR-0054/0060's shared-cookie-domain cookie).

## Context

ADR-0060 put `apps/web` on Cloudflare via the OpenNext adapter specifically to keep both apps on one platform/bill (ADR-0051's budget guardrail) and to make the shared-cookie-domain auth topology simple to reason about. The team has decided to host the frontend on Vercel instead, trading the single-platform cost/ops simplicity for Vercel's native Next.js support (mature ISR, image optimization, edge middleware, zero-config PR preview deployments) and more familiar deploy tooling for the frontend.

`apps/web` has no direct dependency on Cloudflare bindings (D1/KV) — it only calls `apps/api` over HTTP via the Hono RPC client (`NEXT_PUBLIC_API_URL` / `API_INTERNAL_URL`), so nothing in the app layer blocks this move.

## Decision

- Host `apps/web` (Next.js) on **Vercel**, using Vercel's native Next.js build (no OpenNext adapter).
- Keep `apps/api` (Hono) on its own **Cloudflare Worker**, unchanged from ADR-0060.
- Domain topology, revised from ADR-0060: ship on each platform's **free default domain** for now — `<project>.vercel.app` for the frontend, `<worker>.workers.dev` for the API — deferring a custom-domain purchase rather than blocking launch on it. These are different registrable domains (not a subdomain split), so the shared-cookie-domain approach ADR-0060 depended on doesn't apply here; see ADR-0064 for the auth-transport consequence (bearer token instead of a cross-site cookie).
- The API needs CORS middleware (`Access-Control-Allow-Origin` set to the exact deployed frontend origin(s), `Access-Control-Allow-Headers` including `Authorization, Content-Type`) since frontend and API are unconditionally different origins now.
- Local dev is unaffected: keep the Next.js rewrite proxy (`/api/*` → local Wrangler dev server) from ADR-0060/`docs/technical-design.md`.
- CI/CD: frontend deploys via Vercel's native Git integration (auto preview per PR, auto-promote to production on merge to `main`); the API deploys via a GitHub Actions workflow running `wrangler d1 migrations apply --remote` then `wrangler deploy`, since Workers has no equivalent "connect repo, done" flow that also sequences DB migrations first.

## Consequences

Benefits:

- Full native Next.js feature support on Vercel (ISR, image optimization, edge middleware) instead of the OpenNext adapter's partial/evolving Cloudflare support.
- Free, automatic per-PR preview deployments for the frontend with no custom CI work.
- Team gets to use whichever hosting tooling it's more familiar with for the frontend.

Tradeoffs:

- Loses ADR-0051/0060's "one platform, one bill" simplicity. Vercel's Hobby tier disallows commercial use per its ToS; a paying-teachers product will likely need Vercel Pro (~$20/month), which alone may approach or exceed the 2,000 BDT/month budget guardrail before any Cloudflare cost is counted. Re-verify the budget guardrail against actual Vercel + Cloudflare invoices once both are live, and revisit if it's blown.
- Two dashboards/log surfaces (Vercel + Cloudflare Workers) instead of one for observability during a live exam.
- DNS is split across whichever registrar/DNS host is used and must route the apex to Vercel and `api.` to the Worker correctly — a one-time setup risk, not an ongoing one.

## Follow-up

- A custom domain (and the apex/`api.` subdomain split ADR-0060 originally described) remains an option for later — see ADR-0064's follow-up for what would (and wouldn't) need to change if that happens.
- Re-check the ADR-0051 budget guardrail once real Vercel billing is in place.
