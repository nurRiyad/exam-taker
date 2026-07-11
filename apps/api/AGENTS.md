# API Agent Instructions

Use this file for backend-specific guardrails in `apps/api`.

## Stack And Boundaries

- Runtime: Hono on Cloudflare Workers.
- Data: Drizzle ORM on D1.
- Validation: Zod.
- Layering is required: routes -> controllers -> services -> repositories.
- Keep shared technical helpers in `src/utils` and shared TS-only types in `src/types`.

## Critical Routing Rule

- Keep route handlers inline in route chains (one-line delegates to controllers).
- Do not extract route handlers into named constants/functions; this can break Hono RPC inference consumed by `apps/web`.

## Error Handling Rule

- Services must stay Hono-free and throw domain errors from `src/utils/errors.ts`.
- Controllers/middleware shape HTTP responses.

## Auth/CORS Rule

- Auth uses bearer tokens in the `Authorization` header.
- Keep CORS aligned with the frontend origin allow-list and include `Authorization` in allowed headers.
- Do not switch to credentialed cookie CORS flow.

## Database And Migrations

- Generate SQL with `drizzle-kit generate`.
- Apply migrations with Wrangler (`wrangler d1 migrations apply ...`), not with a parallel migration system.
- Do not hand-edit generated migration SQL unless explicitly required.
- Do not hand-edit `worker-configuration.d.ts`; regenerate via `pnpm --filter api types`.

## Commands

- `pnpm --filter api dev`
- `pnpm --filter api typecheck`
- `pnpm --filter api test`
- `pnpm --filter api lint`
- `pnpm --filter api db:generate`
- `pnpm --filter api db:migrate:local`
- `pnpm --filter api db:migrate:remote`
- `pnpm --filter api db:seed:admin`

## Related Docs

- Project-wide rules: [../../AGENTS.md](../../AGENTS.md)
- Canonical architecture and ADR constraints: [../../CLAUDE.md](../../CLAUDE.md)
- D1 conventions: [../../.claude/skills/d1-schema/SKILL.md](../../.claude/skills/d1-schema/SKILL.md)