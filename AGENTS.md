# Exam Taker Agent Instructions

Use this file as the high-level entry point for coding agents in this repo.

## Start Here

- Read [CLAUDE.md](CLAUDE.md) first. It is the canonical project-wide agent guidance.
- Treat [docs/README.md](docs/README.md) as the docs hub and [docs/adr/](docs/adr/) as source-of-truth decisions.
- If code behavior conflicts with docs, follow docs and surface the mismatch.

## Essential Workflow

- Run `nvm use` first (Node `24.14.1` from `.nvmrc`).
- Use pnpm only (root `packageManager` is `pnpm@10.6.2`).
- Prefer workspace scripts from root:
  - `pnpm dev`, `pnpm dev:api`, `pnpm dev:web`
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`
  - `pnpm db:generate`, `pnpm db:migrate:local`, `pnpm db:studio`

## Repo Boundaries

- Backend lives in [apps/api](apps/api): Hono + Workers + D1 + Drizzle.
- Frontend lives in [apps/web](apps/web): Next.js 16 + Tailwind + shadcn.
- For app-specific conventions, read:
  - [apps/api/AGENTS.md](apps/api/AGENTS.md)
  - [apps/web/AGENTS.md](apps/web/AGENTS.md)

## Keep Docs In Sync

- When product or architecture decisions change, follow [.claude/skills/documentation-maintenance/SKILL.md](.claude/skills/documentation-maintenance/SKILL.md).