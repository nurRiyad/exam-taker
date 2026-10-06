# Development

## Requirements

- Node `24.14.1` (`nvm use`)
- pnpm `10.6.2`

## Setup

```bash
make setup
```

`make setup` installs the Node version from `.nvmrc`, selects it, installs pnpm
dependencies, generates pending Drizzle migrations, applies them to local D1,
and starts the web and API development servers. Stop the servers with `Ctrl+C`.

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
