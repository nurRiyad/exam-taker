# ADR 0054: JWT-based Authentication With PBKDF2 Password Hashing

## Status

Accepted, except the cookie-transport piece of the Decision below (line "Store the JWT in an httpOnly... cookie") — that is superseded by [ADR-0064](0064-bearer-token-auth-default-domains.md) now that frontend and API are on different registrable domains. JWT issuance, PBKDF2 hashing, 30-day flat expiry, and the "claims are a UI convenience only" principle are all still in effect unchanged.

## Context

ADR-0020 decided on simple password login without OTP, but did not specify the session mechanism or the password hashing algorithm. Cloudflare Workers has a CPU-time limit per request, which makes bcrypt/argon2 a poor fit without a WASM dependency. The app is browser-based and mobile-first, not a native app that needs bearer-token storage patterns.

## Decision

- Use JWT for authentication. On successful login, issue a signed JWT (HS256, secret stored as a Workers secret, never committed to code) containing user id, role, and tenant/course-membership hints needed for fast UI-level checks.
- Store the JWT in an httpOnly, Secure, SameSite cookie, not in localStorage, to reduce token-theft risk via XSS. This assumes the frontend and API are served from the same top-level site (consistent with ADR-0052's single deployment); if hosting later splits frontend and API across different sites, revisit cookie vs. Authorization-header storage at that time.
- Token expiry: 30 days, flat (no refresh-token flow in MVP). Users re-login after expiry.
- Password hashing: PBKDF2-SHA256 via the Web Crypto API (`crypto.subtle`, natively available in Workers), with a per-user random salt and a modern iteration count. Store salt and iteration count alongside the derived hash on `User.password_hash` (as a single encoded string, for example `pbkdf2$<iterations>$<salt>$<hash>`).
- JWT claims are a convenience for identity and cheap role gating in the UI. Every server-side authorization check that matters (a teacher only sees their own tenant's students, ADR-0032) is still enforced by querying the actual course/tenant membership in the database, not by trusting JWT claims alone.

## Consequences

Benefits:

- No SMS/OTP cost, consistent with ADR-0020/ADR-0025.
- Stateless session validation: verifying a request is authenticated needs no KV/D1 lookup, only signature/expiry checks.
- Uses Workers-native crypto with no external dependency.

Risks:

- A leaked JWT secret compromises all active sessions. It must live only as a Workers secret and be rotated immediately if ever exposed.
- No server-side revocation list in MVP means a stolen token stays valid until it expires. Acceptable at pilot scale; revisit if abuse appears.

## Follow-up

- Add a lightweight revocation/blocklist in KV (checked only when a token is flagged, so it stays off the hot path) if a pilot shows a real need to force-logout a specific user.
- Confirm Next.js hosting target (Cloudflare Pages vs. other) before finalizing cookie domain/SameSite settings.
