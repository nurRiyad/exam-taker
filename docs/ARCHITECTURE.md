# Architecture

The UI-first phase is complete enough to begin API integration. For each requested page or flow, add a Hono endpoint backed by realistic hard-coded service data. Production business rules and database persistence remain out of scope until separately requested.

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

Connect each requested UI flow to a typed Hono API route. Keep hard-coded demo records in the corresponding API feature service. Put request schemas shared by web and API in `packages/validation`; add production business logic, database schema/client/migrations in `packages/db` only when explicitly requested.

## Application boundaries

- `apps/web` owns pages, components, browser state, and UI-facing data adapters.
- Browser-side API state uses TanStack Query. Keep endpoint request functions in `apps/web/src/features/<feature>/api.ts` and feature query keys/hooks in `queries.ts`; keep the shared typed Hono client and cross-cutting helpers in `apps/web/src/utils/`. Client components call query/mutation hooks rather than issuing requests directly.
- Server Components, Next proxy code, and other server-only contexts call request functions directly, with explicit cookie/token and cache behavior; they do not use client hooks.
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
