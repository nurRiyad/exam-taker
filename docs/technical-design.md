# Technical Design

This is the detailed engineering reference: exact stack, project structure, local dev workflow, and production deployment. Product/architecture *decisions* and their rationale live in `docs/adr/*` — this doc explains how those decisions fit together operationally. Start with `docs/README.md` if you need the "why" behind any choice below.

## Stack Summary

| Layer | Choice | Decision record |
|---|---|---|
| Backend framework | Hono on Cloudflare Workers | ADR-0004 |
| Relational database | Cloudflare D1 (SQLite) | ADR-0004 |
| Query layer | Drizzle ORM (`drizzle-orm/d1`) | ADR-0059 |
| Migrations | `drizzle-kit generate` → SQL files → `wrangler d1 migrations apply` | ADR-0059, `.claude/skills/d1-schema` |
| Validation | Zod, with `drizzle-zod` deriving schemas from DB tables where shapes overlap | ADR-0059 |
| Cache / ephemeral data | Cloudflare KV (never source of truth for submissions/payments) | ADR-0004 |
| Auth | JWT as a bearer token (`Authorization: Bearer`, stored client-side in a non-httpOnly cookie), PBKDF2-SHA256 password hashing via Web Crypto | ADR-0054, ADR-0064 |
| Tenancy | One shared multi-tenant deployment, scoped by `tenant_id` | ADR-0052 |
| Frontend framework | Next.js (App Router) | ADR-0005 |
| Frontend hosting | Vercel (native Next.js build, no adapter) | ADR-0063 (supersedes ADR-0060) |
| API hosting | Cloudflare Worker | ADR-0060, ADR-0063 |
| Domain topology | Free default domains for now — `*.vercel.app` (frontend), `*.workers.dev` (API); no custom domain yet | ADR-0063 |
| CORS | API allow-lists the exact deployed frontend origin(s), allows `Authorization` header, no credentialed cookies | ADR-0064 |
| CI/CD | GitHub Actions: lint/format/test on every PR; on merge to `main`, API migrates+deploys via Wrangler, frontend deploys via Vercel's Git integration | ADR-0063 |
| Component system | Tailwind CSS + shadcn/ui | ADR-0061 |
| Design posture | Mobile-first everywhere, not just the exam page | ADR-0061, ADR-0002 |
| API type sharing | Hono RPC (`hono/client`), type-only import of the API's `AppType` — no generated client, no separate types package | ADR-0059 |
| Backend code layering | `apps/api` routes → controllers → services → repositories, one set per resource | ADR-0062 |
| PDF/print | `pdf-lib`-style direct generation, no headless browser | ADR-0057 |
| Monorepo tooling | pnpm workspaces (no Turborepo yet — two apps don't need it; add later if build times justify it) | this doc |
| Budget guardrail | Under 2,000 BDT/month during early validation | ADR-0051 |

## Project Structure

```
exam-taker/
├── apps/
│   ├── api/                          # Hono backend, deployed as a Cloudflare Worker
│   │   ├── migrations/               # D1 migrations, wrangler-applied, numbered, forward-only
│   │   │   └── 0001_init.sql
│   │   ├── src/
│   │   │   ├── db/
│   │   │   │   ├── schema.ts         # Drizzle schema, mirrors applied migrations exactly
│   │   │   │   └── client.ts         # drizzle(env.DB) factory
│   │   │   ├── routes/                # thin Hono chains: path/method/validator/guard, inline handlers only (ADR-0062)
│   │   │   │   ├── auth.ts
│   │   │   │   ├── courses.ts
│   │   │   │   ├── exam-topics.ts
│   │   │   │   ├── exams.ts
│   │   │   │   ├── questions.ts
│   │   │   │   ├── attempts.ts
│   │   │   │   ├── billing.ts
│   │   │   │   └── admin.ts
│   │   │   ├── controllers/           # HTTP orchestration: status codes, response shaping, cookies (ADR-0062)
│   │   │   │   └── auth.controller.ts
│   │   │   ├── services/              # business logic, no Hono imports, throws utils/errors.ts errors (ADR-0062)
│   │   │   │   └── auth.service.ts
│   │   │   ├── repositories/          # Drizzle query builders only, one file per table (ADR-0062)
│   │   │   │   ├── users.repository.ts
│   │   │   │   └── reset-codes.repository.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts           # verifies JWT, attaches user + role to context
│   │   │   │   ├── tenant-scope.ts   # enforces tenant/course-membership filtering
│   │   │   │   └── error-handler.ts  # maps HTTPException and domain errors (utils/errors.ts) to responses
│   │   │   ├── utils/                 # shared technical helpers, no resource/route awareness
│   │   │   │   ├── password.ts       # PBKDF2 hash/verify (ADR-0054)
│   │   │   │   ├── jwt.ts            # sign/verify only, no cookie helpers (bearer token, ADR-0064)
│   │   │   │   ├── phone.ts, sqlite-time.ts, user.ts, reset-code.ts
│   │   │   │   └── errors.ts         # domain error classes (ConflictError, UnauthorizedError, ...)
│   │   │   ├── types/                 # shared TS-only types; index.ts re-exports each file
│   │   │   │   ├── role.ts
│   │   │   │   └── index.ts
│   │   │   ├── validation/           # Zod schemas: drizzle-zod derived + hand-written request shapes
│   │   │   └── index.ts              # Hono app entry; exports `AppType` for RPC
│   │   ├── drizzle.config.ts
│   │   ├── wrangler.jsonc
│   │   └── package.json
│   └── web/                          # Next.js frontend, deployed to Vercel (ADR-0063)
│       ├── src/
│       │   ├── app/                  # App Router
│       │   │   ├── (public)/         # Public teacher pages, public past-exam list
│       │   │   ├── (student)/        # Student dashboard, course join, exam attempt flow
│       │   │   ├── (teacher)/        # Teacher admin: courses, exams, questions, billing view
│       │   │   └── (admin)/          # Platform admin: tenants, support, invoices
│       │   ├── components/
│       │   │   └── ui/               # shadcn/ui primitives, copied in and edited directly
│       │   ├── lib/
│       │   │   └── api-client.ts     # hc<AppType>() instance (Hono RPC client)
│       │   └── i18n/
│       │       ├── en/               # launch language
│       │       └── bn/               # empty placeholders (ADR-0047)
│       ├── next.config.ts            # rewrites() proxy to API worker in dev
│       └── package.json
├── .github/
│   └── workflows/                    # CI (lint/format/test on PR) + CD (API migrate+deploy on merge to main) (ADR-0063)
├── docs/                             # product spec, ADRs, data model, glossary, build plan
├── .claude/
│   └── skills/                       # product-knowledge, d1-schema, documentation-maintenance
├── package.json                      # pnpm workspace root
├── pnpm-workspace.yaml
└── CLAUDE.md
```

Notes:

- `apps/api/src` is layered routes → controllers → services → repositories per resource (ADR-0062). Route handlers must stay inline one-line arrows in the chain (Hono RPC type inference for `hc<AppType>()` depends on it) and delegate immediately to a controller — the layering happens inside that delegation, not by breaking the chain. Only `auth` is fully layered so far; apply the same shape to each new resource in Steps 4+ rather than reverting to inline route logic.
- No `packages/shared` directory. API contract types flow through Hono's RPC client (`AppType`), and DB-shape validation flows through `drizzle-zod` — both eliminate the usual reason for a shared-types package. Add one later only if a real cross-cutting need shows up (for example, shared constants used by both apps that aren't API-shaped), not preemptively.
- Route groups in `apps/app/` — `(public)`, `(student)`, `(teacher)`, `(admin)` — map directly to the four roles in `docs/mvp-spec.md`; this is a Next.js App Router convention (parentheses = no effect on the URL path), used purely to keep each role's pages and layouts organized separately.

## Local Development

Prerequisites: Node `24.14.1` (pinned in `.nvmrc` — run `nvm use` in the repo root before anything else; this environment's shell does not auto-switch on `cd`), `pnpm` (via Corepack — `corepack enable` once per Node install), the Wrangler CLI. A Cloudflare account is only needed for `wrangler login` and remote operations — local dev (including local D1) works offline.

1. **Switch Node versions**: `nvm use` (reads `.nvmrc`). Re-run this every time you start a new shell in this repo.
2. **Install**: `pnpm install` at the repo root (installs both apps' dependencies through the workspace).
3. **Apply migrations locally**: `pnpm db:migrate:local` → runs `wrangler d1 migrations apply exam-taker-db --local`, which creates a local SQLite file simulating D1. No real Cloudflare resource needed for this.
4. **Run both dev servers**: `pnpm dev` at the root, which runs concurrently:
   - `apps/api`: `wrangler dev` on port 8787.
   - `apps/web`: `next dev` on port 3000 (Next.js auto-falls back to 3001+ if 3000 is already taken locally), with `next.config.ts` `rewrites()` forwarding `/api/*` → the API dev server.
5. Open the printed `apps/web` URL. The auth token travels as an `Authorization: Bearer` header attached by application code (ADR-0064), so it works the same whether the browser call is same-origin (dev, via the rewrite proxy) or cross-origin (prod, direct to `*.workers.dev`) — the rewrite proxy is kept for convenience but isn't load-bearing for auth. Server Components call the API's origin directly (`API_INTERNAL_URL`, defaults to `http://localhost:8787`), bypassing the rewrite entirely, reading the token from the request's cookies to attach the header themselves.
6. **Changing the schema**: edit `apps/api/src/db/schema.ts`, run `pnpm --filter api db:generate` (`drizzle-kit generate`, writes the next numbered migration into `apps/api/migrations/`), review the generated SQL, then re-run step 3 to apply it locally.
7. **Inspecting local DB state**: `pnpm --filter api db:studio` (`drizzle-kit studio`) opens a browser UI (`https://local.drizzle.studio`, talking to a local server on port 4983) against the same local D1 sqlite file `wrangler dev`/`db:migrate:local` use — `apps/api/drizzle.config.ts` resolves that file's path itself (its name includes a wrangler-generated hash). Requires `better-sqlite3`'s native binary, approved once via `pnpm-workspace.yaml`'s `onlyBuiltDependencies` (`pnpm install` builds it automatically).

## Production Deployment

**One-time setup** (default domains, per ADR-0063/ADR-0064 — no custom domain purchase needed):

1. `wrangler d1 create exam-taker-db` (remote) and `wrangler kv namespace create CACHE` (remote); fill the real IDs into `apps/api/wrangler.jsonc` in place of the current placeholders.
2. `wrangler secret put JWT_SECRET` for the API Worker — never committed to code (ADR-0054).
3. `wrangler deploy` once to learn the API's real `*.workers.dev` URL (or set a custom Workers name in `wrangler.jsonc` to make it predictable ahead of time).
4. Create a Vercel project for `apps/web`, connected to the GitHub repo (monorepo root directory set to `apps/web`).
5. Set `NEXT_PUBLIC_API_URL=https://<worker-name>.<account>.workers.dev` as a Vercel environment variable.
6. Once the real `*.vercel.app` URL is known, add it to the API's CORS allow-list (`apps/api/src/index.ts`).
7. Create GitHub Actions secrets for CI/CD: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (API deploy + migrations).

**Per-release steps (automated, ADR-0063):**

- **Every PR**: GitHub Actions runs lint, format check, and tests for both apps (`.github/workflows/ci.yml`).
- **On merge to `main`**:
  - **API**: `.github/workflows/deploy-api.yml` runs `wrangler d1 migrations apply exam-taker-db --remote`, then `wrangler deploy` from `apps/api`.
  - **Frontend**: Vercel's own Git integration auto-builds and promotes `apps/web` to production — no GitHub Actions step needed for this half.

**Rollback:**

- Workers keep prior deployments — `wrangler rollback` reverts the API.
- Vercel keeps prior deployments too — redeploy or instantly roll back to any previous build from the dashboard.
- D1 migrations are forward-only. A bad migration is fixed with a new corrective migration, never a rollback of the migration file itself (`.claude/skills/d1-schema`).

## Environment Variables / Secrets Reference

| Name | Where | Set via |
|---|---|---|
| `JWT_SECRET` | `apps/api` (Worker secret) | `wrangler secret put JWT_SECRET` |
| D1 binding (`DB`) | `apps/api/wrangler.jsonc` | `wrangler d1 create`, then fill `database_id` |
| KV binding (`CACHE`) | `apps/api/wrangler.jsonc` | `wrangler kv namespace create`, then fill `id` |
| `NEXT_PUBLIC_API_URL` | `apps/web` (Vercel env var; also a local `.env.local` pointing at the dev proxy) | Vercel dashboard / `.env.local` |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secret (API deploy workflow) | GitHub repo → Settings → Secrets |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secret (API deploy workflow) | GitHub repo → Settings → Secrets |

## Where To Go Next

This doc describes the target shape. The actual scaffolding work (creating `package.json`s, the Drizzle schema, the Hono route skeleton, the Next.js app, shadcn init, OpenNext config) is Step 2 of `docs/build-plan.md` — not yet done. Step 2's exit criteria should be read as: everything in this doc's "Local Development" section works end to end.
