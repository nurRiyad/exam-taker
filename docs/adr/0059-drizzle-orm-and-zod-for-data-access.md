# ADR 0059: Drizzle ORM And Zod For Data Access And Validation

## Status

Accepted

## Context

ADR-0004 committed to Hono on Cloudflare Workers with D1 as the relational store. The initial schema (`apps/api/migrations/0001_init.sql`) was hand-written as plain SQL and is applied via Wrangler's own D1 migration mechanism (forward-only, numbered files — see `.claude/skills/d1-schema`). The open question was which query/ORM layer application code should use on top of D1, and how it relates to Zod (already assumed for request validation) without creating two competing systems that both think they own the schema.

Options considered:

- **Prisma**: strong developer experience and familiarity, but a poor structural fit here. Its D1/Workers support depends on newer driver adapters and a Rust-free query engine that is less battle-tested on Workers than alternatives, and `prisma migrate` wants to own schema migrations — which would compete with Wrangler's D1 migration ownership already established in this project.
- **Raw D1 bindings only** (`env.DB.prepare(...).bind(...).all()`), with Zod validating rows at the boundary: minimal overhead, but no compile-time query safety or schema-to-type generation, and more repetitive hand-written SQL as the schema grows past MVP.
- **Drizzle ORM**: lightweight, ships a first-class `drizzle-orm/d1` driver built for Workers' stateless request model, TypeScript-first schema definitions that double as the type source for queries, and `drizzle-kit` generates plain SQL migration files that Wrangler applies as-is.

## Decision

Use Drizzle ORM as the query layer over D1. Use Zod for request/response validation in Hono routes, and `drizzle-zod` to derive Zod schemas from Drizzle table definitions wherever the shapes overlap (for example, a "create question" payload validates against the same shape as the `questions` table), instead of hand-maintaining two parallel field lists.

Migration workflow:

- `apps/api/src/db/schema.ts` is the TypeScript mirror of the schema, written to exactly match the already-applied `0001_init.sql`.
- From the next schema change onward, use `drizzle-kit generate` to produce the next numbered SQL file directly into `apps/api/migrations/`, then apply it the existing way: `wrangler d1 migrations apply exam-taker-db --local` / `--remote`.
- Migration `0001_init.sql` stays hand-written and untouched; only the authoring process for `0002` onward changes.
- Wrangler remains the single mechanism that actually applies migrations to a database. `drizzle-kit` only diffs `schema.ts` to generate SQL; it never talks to D1 directly for migrations.

Type sharing with the frontend: export the Hono app's route type (`AppType`) from `apps/api` and import it type-only into `apps/web` via the pnpm workspace, using Hono's built-in RPC client (`hono/client`) for end-to-end typed API calls. This avoids a separate hand-maintained shared-types package for API contracts.

## Consequences

Benefits:

- One migration system (Wrangler-applied SQL), not two competing ones.
- Compile-time query safety and autocomplete from `schema.ts` without a heavy runtime or connection pooling to manage.
- `drizzle-zod` removes duplicate field-list maintenance between DB schema and API validation.
- Full frontend/backend type safety on API calls without a generated-client build step.

Tradeoffs:

- Introduces a library dependency and a `schema.ts` that must stay in sync with the actually-applied migrations (see `.claude/skills/d1-schema`).
- Requires learning Drizzle's query builder syntax if unfamiliar; smaller ecosystem than Prisma, though well-established for Cloudflare D1 specifically.
- The Hono RPC type-only import requires `apps/web` and `apps/api` to share a pnpm workspace, which they already do.

## Follow-up

Write `apps/api/src/db/schema.ts` and confirm a trial `drizzle-kit generate` output matches expectations before Step 6 of `docs/build-plan.md` (question bank/exam authoring) introduces any real schema changes.
