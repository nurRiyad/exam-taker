# Development

## Requirements

- Node `24.14.1` (`nvm use`)
- pnpm `10.6.2`

## Setup

```bash
nvm use
pnpm install
pnpm db:migrate:local
pnpm dev
```

The web app runs at `http://localhost:3000`; the API Worker runs at `http://localhost:8787`; Drizzle Studio's local database bridge listens on port `4983` and its browser UI is at `https://local.drizzle.studio`. Studio reads Wrangler's local D1 SQLite database. Apply local migrations once before starting the full development stack. The UI-first workflow should keep screens usable with mock data when the API is unavailable.

## Useful commands

```bash
pnpm dev
pnpm dev:web
pnpm dev:api
pnpm dev:db-studio
pnpm lint
pnpm typecheck
pnpm test
pnpm db:generate
pnpm db:migrate:local
pnpm db:studio
```

Database commands are owned by `packages/db`; Wrangler configuration and Worker runtime bindings remain in `apps/api`.
