# Architecture

This project is being rebuilt incrementally with a UI-first workflow. Keep existing product behavior while improving the structure.

## Repository layout

```text
apps/
  web/             Next.js application; UI and feature modules
  api/             Hono Cloudflare Worker API
    src/features/  Feature-local routes, services, and repositories
packages/
  db/              Drizzle schema, D1 client, and migrations
  validation/      Shared Zod schemas and inferred TypeScript types
docs/              Product and engineering guides
```

## Development sequence

Build and polish complete user flows in `apps/web` with realistic mock data first. Keep mocks local to their product feature and make the UI usable without a running API. After the screens and interaction patterns are established, replace mock adapters with API calls. Put request schemas shared by web and API in `packages/validation`; put database schema/client/migrations in `packages/db`.

## Application boundaries

- `apps/web` owns pages, components, browser state, and UI-facing data adapters.
- `apps/api` owns HTTP endpoints and server-side application behavior.
- API feature modules keep routes, services, and repositories together under `apps/api/src/features/<feature>`; routes call services directly and there is no controller layer.
- `packages/validation` owns reusable Zod schemas and their inferred input/output types.
- `packages/db` owns Drizzle tables, the D1 client, and migrations.
- API contract types can be consumed from `apps/api` through Hono RPC; do not duplicate endpoint response types by hand.

Feature code should be grouped by product area where practical. Keep related UI and API feature files easy to locate, and share only code that has a real cross-app consumer.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui
- Hono on Cloudflare Workers
- Cloudflare D1 with Drizzle ORM
- Zod validation
- pnpm workspaces

Implementation details belong in focused documents such as `DEVELOPMENT.md`, `QUALITY.md`, and `DEPLOYMENT.md`.
