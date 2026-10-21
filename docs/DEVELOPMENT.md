# Development

## Requirements

- Node `24.14.1` (`nvm use`)
- pnpm `10.6.2`

## Setup

Running `make` with no target runs `make precommit`. Use `make setup` explicitly
when preparing a fresh local checkout and starting the development servers.

```bash
make setup
```

`make setup` installs the Node version from `.nvmrc`, selects it, installs pnpm
dependencies, generates pending Drizzle migrations, applies them to local D1,
and starts the web and API development servers. Stop the servers with `Ctrl+C`.

The web app runs at `http://localhost:3000`; the API Worker runs at `http://localhost:8787`; Drizzle Studio's local database bridge listens on port `4983` and its browser UI is at `https://local.drizzle.studio`. Studio reads Wrangler's local D1 SQLite database. Apply local migrations once before starting the full development stack. For each requested page or flow, connect the UI to a Hono endpoint that returns hard-coded data from a feature-local API service. Keep product business rules and database persistence out of these demo endpoints until requested.

## UI API pattern

Use TanStack Query for browser-side server state. Place typed endpoint functions in `apps/web/src/features/<feature>/api.ts` and query keys/options/hooks in `queries.ts` alongside them. Client components consume hooks instead of calling `apiClient` or `fetch` directly. Use queries for reads and mutations for writes; update or invalidate related query data after successful mutations. The shared typed Hono client and API utilities live under `apps/web/src/utils/`.

Server Components, `proxy.ts`, and other server-only callers cannot use React hooks. They call the feature request functions directly and explicitly handle cookies/tokens and cache behavior.

## Authentication

Local API development uses the JWT secret in the ignored `apps/api/.dev.vars` file. Admin and teacher accounts are global and log in with email or phone. A teacher owns one page. Students sign up and log in from a teacher page; their account is unique within that page and shared across its courses, batches, and exams. Passwords must contain 5–20 characters. `GET /auth/me` resolves the account and, for teachers and students, returns the associated page context.

## Useful commands

```bash
pnpm dev
pnpm dev:web
pnpm dev:api
pnpm dev:db-studio
pnpm lint
pnpm typecheck
pnpm test
make setup
make precommit
pnpm db:generate
pnpm db:migrate:local
pnpm db:studio
```

Run `make precommit` before committing to generate pending Drizzle migrations,
apply migrations to the local D1 database, format the repository, run lint,
typecheck and tests, then build the web app and dry-run the API Worker bundle.
This target uses local migrations only; it never changes the remote database.

Database commands are owned by `packages/db`; Wrangler configuration and Worker runtime bindings remain in `apps/api`.
