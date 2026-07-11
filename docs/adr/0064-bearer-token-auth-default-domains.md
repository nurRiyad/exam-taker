# ADR 0064: Bearer-Token JWT Auth For Cross-Origin Default Domains

## Status

Accepted. Resolves the open follow-up in [ADR-0054](0054-jwt-auth-with-pbkdf2-password-hashing.md) ("if hosting later splits frontend and API across different sites, revisit cookie vs. Authorization-header storage"), triggered by the decision (alongside [ADR-0063](0063-frontend-on-vercel-api-on-cloudflare.md)) to ship on each platform's free default domain (`*.vercel.app`, `*.workers.dev`) rather than buying a custom domain up front.

## Context

ADR-0063 assumed a shared custom registrable domain (apex + `api.` subdomain) so ADR-0054/0060's httpOnly `SameSite` cookie kept working same-site. The team has decided to skip a domain purchase for now and use `*.vercel.app` (frontend) and `*.workers.dev` (API) directly. These are different registrable domains, so the cookie would have to become a third-party (`SameSite=None`) cookie to be sent cross-site at all — and third-party cookies are blocked by default in Safari today (a meaningful share of this product's mobile users), with Chrome also trending that direction. That's not viable for real auth persistence.

## Decision

- Auth transport changes from an httpOnly `Set-Cookie` to a bearer token returned in the JSON response body:
  - `POST /auth/signup` and `POST /auth/login` return `{ user, token }` instead of setting a cookie.
  - Every authenticated request sends `Authorization: Bearer <token>`.
  - `apps/api`'s `authenticate()` middleware reads the token from the `Authorization` header instead of a cookie.
- The frontend persists the token in a **non-httpOnly** cookie (e.g. `session_token`; `Secure`, `SameSite=Lax`, no `Domain` attribute — it isn't shared cross-site) so it's readable both by client-side JS (to attach the header on every browser `fetch`/`hc` call) and by Next.js Server Components / `proxy.ts` (via `next/headers` `cookies()`, to attach the header on server-to-server calls and to redirect in `proxy.ts` when absent).
  - This deliberately gives up ADR-0054's original httpOnly XSS protection — the token becomes readable by any injected JS. Mitigate with normal XSS hygiene (React's default escaping, no `dangerouslySetInnerHTML` with unsanitized input, CSP later) — there is no cookie-specific mitigation left once httpOnly is gone.
  - Reading this cookie for a middleware redirect is a UI convenience only, not an authorization check — consistent with ADR-0054's existing principle that every real authorization decision hits the DB server-side.
- `apps/api` needs CORS middleware (previously absent — the app had none because same-origin was assumed): `Access-Control-Allow-Origin` set to the exact deployed frontend origin(s), `Access-Control-Allow-Headers` including `Authorization, Content-Type`. `Access-Control-Allow-Credentials` is not needed since the token is attached explicitly by application code, not sent as an ambient cookie via `credentials: 'include'` — this also means the design carries no CSRF exposure the way a cross-site cookie would.
- Logout clears the client-side cookie only; there is still no server-side revocation list (unchanged risk from ADR-0054).
- Local dev keeps the existing Next.js `/api/*` rewrite proxy (harmless), but it's no longer load-bearing for auth: the Authorization header works the same whether the browser call is same-origin (dev, via proxy) or cross-origin (prod, direct to `*.workers.dev`).

## Consequences

Benefits:

- Works correctly on free default domains — no custom domain purchase required to ship.
- No third-party-cookie fragility: uniform behavior across Safari, Chrome, Firefox.
- No CSRF exposure (no ambient credential automatically attached cross-site).

Tradeoffs:

- Token is readable by JS, which defeats httpOnly's XSS mitigation — accepted given the alternative (buying a domain) was explicitly declined for now.
- More frontend plumbing: every request must explicitly attach the header, and the token must be captured from the response body on login/signup instead of assumed-set by the browser.
- Still no distinction between "log out this device" and "log out everywhere" — a stolen token remains valid until natural expiry (same accepted risk as ADR-0054).

## Follow-up

- If a custom domain is purchased later (ADR-0063's original plan), this decision does not need to be reverted — bearer-token auth works fine same-site too. Only revisit if a concrete reason (e.g. a security audit finding) argues for httpOnly cookies again.
- Implementation touches `apps/api/src/utils/jwt.ts`, `apps/api/src/controllers/auth.controller.ts`, `apps/api/src/middleware/auth.ts`, `apps/api/src/index.ts` (add CORS), and `apps/web/src/lib/api-client.ts`, `apps/web/src/proxy.ts`, and the login/signup pages — tracked as part of the current deployment-setup work, not a new build-plan step, since Step 3's auth vertical slice already exists and this is a transport-only revision to it.
