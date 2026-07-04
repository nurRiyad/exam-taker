# ADR 0062: API Layering — Routes → Controllers → Services → Repositories

## Status

Accepted

## Context

`apps/api/src` started flat (ADR-0004): `routes/`, `middleware/`, `lib/`, `validation/`, `db/`. Through Step 3, this held up fine with a single resource (`routes/auth.ts`), but that one file mixed three concerns in every handler — Hono/HTTP wiring, business rules (conflict checks, vague-error policy, reset-code candidate matching), and Drizzle queries — all inline.

Alongside this restructure, `lib/` (shared technical helpers with no resource/route awareness — crypto, formatting, cookie mechanics) is renamed `utils/`, and the previously single-file `types.ts` becomes a `types/` folder with one file per shared type plus an `index.ts` barrel (`export * from "./role"`, etc.) so `../types` keeps resolving from anywhere in `src` as more shared types are added. Both are naming/organization refinements only — no behavior change, no new architectural layer.

Steps 4–12 of `docs/build-plan.md` add courses, exam topics, exams, questions, attempts, billing, and admin tooling — a large, ongoing expansion of route surface. Without a convention, each new resource repeats the same mixing at growing scale, making business logic hard to test in isolation (would require mocking Hono `Context`/cookies/env just to test a conflict-check rule) and hard to review (HTTP concerns, rules, and SQL interleaved in one function).

Options considered:

- **Keep the flat layout**, relying on discipline/code review to keep handlers small. Cheapest short-term, but doesn't scale past a handful of resources — exactly the pattern already straining in `routes/auth.ts`.
- **Routes + services only** (no separate controllers or repositories): fewer files, but conflates "shape the HTTP response" with "decide the business outcome," and leaves Drizzle queries scattered across service files with no single place to find or reuse them per table.
- **Full four-layer split — routes / controllers / services / repositories**: more files per resource, but each layer has one clear job and one clear dependency direction (routes → controllers → services → repositories), and business logic becomes unit-testable without any Hono involvement.

## Decision

Adopt a four-layer structure for `apps/api/src`, applied per resource:

- **`routes/<resource>.ts`** — unchanged responsibility: a single chained `new Hono<Env>()...` per resource (path, method, `zValidator`, auth guards). **Handlers must stay inline one-line arrows in the chain** — this is a hard constraint, not a style preference: Hono RPC type inference for `hc<AppType>()` (consumed by `apps/web`) depends on the chain being unbroken and handlers written at the call site. Routes extract `c.req.valid(...)` (the only place the per-route validated type is known without hand-written generics) and immediately delegate to a controller, e.g. `(c) => authController.login(c, c.req.valid("json"))`.
- **`controllers/<resource>.controller.ts`** — the only layer aware of both Hono `Context` and the service layer. One function per route, including trivial ones (no exceptions carved out, so "routes never contain logic" stays a uniform rule). Owns status codes, `c.json(...)` shaping, and session cookie issuance (cookies need `c`, so this cannot live in the service).
- **`services/<resource>.service.ts`** — pure business logic. Zero Hono imports (no `Context`, no `HTTPException`, no cookies). Signature shape `(db: Database, input, ...plainConfig)`. Throws the new domain error classes (`utils/errors.ts`: `DomainError`, `ConflictError`, `UnauthorizedError`, `NotFoundError`, `BadRequestError`) instead of `HTTPException`. Calls repositories for all DB access.
- **`repositories/<table>.repository.ts`** — one file per DB table/aggregate, Drizzle query builders only, no business rules. Plain functions taking `db` as the first argument (matches the existing functional style in `utils/`; no classes/DI — Workers' per-request isolate model has no long-lived singleton to inject into). Cross-table atomic operations (e.g. `db.batch([...])`) are supported by having repositories expose non-`async` statement-builder functions (returning the *unexecuted* query) that the service composes inline at the `db.batch([...])` call site.
- **`utils/errors.ts`** — the domain error vocabulary above. `middleware/error-handler.ts` gained one branch mapping `DomainError`/`ConflictError` to the correct status/body, ahead of its existing `HTTPException` handling (unchanged, still used by `middleware/auth.ts`'s `requireAuth`/`requireRole`).

Applied to the `auth` resource as the reference implementation: `routes/auth.ts`, `controllers/auth.controller.ts`, `services/auth.service.ts`, `repositories/users.repository.ts`, `repositories/reset-codes.repository.ts`.

## Consequences

Benefits:

- Business logic (conflict checks, vague-error policy, reset-code matching) is now unit-testable with a fake `Database` and zero Hono mocking.
- Drizzle queries for a given table live in exactly one file, reviewable and reusable across services.
- The pattern generalizes directly to Steps 4–12's new resources without re-deriving structure each time.

Tradeoffs:

- More files per resource (4–5 instead of 1) — proportionate given the number of resources still to come, not justified for a single-resource API.
- Two call conventions inside repositories (normal `async` functions vs. non-`async` `...Query`-suffixed statement builders for batching) — a real subtlety, documented inline where it's used (see `services/auth.service.ts`'s `redeemResetCode`).
- `docs/technical-design.md`'s previously flat `apps/api` tree is now stale for this decision; updated alongside this ADR.

## Follow-up

Apply the same four-layer shape when Step 4 (courses/tenant/access workflow) adds its first new resource, rather than reverting to inline route logic under time pressure.
