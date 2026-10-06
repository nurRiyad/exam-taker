# Exam Taker Agent Instructions

This repository is being rebuilt with a UI-first workflow. Keep the current application code and migrate it incrementally into the structure below.

## Structure

- `apps/web`: Next.js UI and product modules.
- `apps/api`: Hono Worker API; build or expand this after the UI is established with mock data.
- `packages/db`: Drizzle schema, database client, and D1 migrations.
- `packages/validation`: shared Zod schemas and inferred types for UI and API.
- `docs`: concise product, development, architecture, quality, and deployment guidance.

## Workflow

1. Build polished, responsive UI flows in `apps/web` using realistic local/mock data.
2. Keep mock data and UI state near the relevant product feature.
3. Once UI flows are settled, connect them to API endpoints in `apps/api`.
4. Use shared validation from `packages/validation` and database access from `packages/db`.
5. Preserve working routes and functionality while restructuring; avoid speculative feature changes.

## Tooling

- Use Node `24.14.1` from `.nvmrc` and pnpm only.
- Use root workspace commands where available: `pnpm dev`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- Keep one Git repository at the project root.
- Keep local D1 data and secrets out of version control.

## Project Skills

- Use `.agents/skills/vercel-react-best-practices/SKILL.md` for React/Next.js implementation, refactoring, or performance review. Read the linked rule files as needed.
- Use `.agents/skills/web-design-guidelines/SKILL.md` when auditing UI accessibility, usability, or interface quality; it retrieves the current review checklist before each audit.
