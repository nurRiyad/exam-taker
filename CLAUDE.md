# Exam Taker

Mobile-first exam platform for Bangladesh coaching teachers: branded course pages, scheduled MCQ exams, live rankings, weak-zone analysis. First wedge: replacing printed/offline MCQ exam operations for BCS/government-job prep. Full product context: `docs/README.md` (start there), or load the `product-knowledge` skill for a fast summary.

## Source Of Truth

- `docs/adr/*` — every product/architecture decision, numbered sequentially, never edited after acceptance (superseded ones say so in their Status line, not deleted).
- `docs/data-model.md` — product-level entity model, mirrored by `apps/api/migrations/`.
- `docs/glossary.md` — the one definition of every product term.
- `docs/build-plan.md` — the sequential implementation roadmap. Work through it in order; don't skip ahead to a later step's concerns.
- `docs/implementation-plan.md` — per-step backend-then-frontend breakdown of `build-plan.md` (endpoints, files, pages, status). Keep its status markers current as steps land.
- `docs/mvp-spec.md`, `docs/product-brief.md` — the narrative specs the ADRs formalize.
- `docs/technical-design.md` — stack, project structure, local dev, and production deployment in full detail. Read this before scaffolding or restructuring either app.

When a request conflicts with something these docs say, the docs win — surface the conflict rather than silently picking one. When you make or the user makes a new product/architecture decision, follow `.claude/skills/documentation-maintenance/SKILL.md` to keep everything in sync; don't let code and docs drift.

## Architecture (do not relitigate these without a new ADR)

- **One shared multi-tenant deployment** — not per-teacher deployments. Every query touching teacher- or student-owned data must be scoped by `tenant_id`/course membership (ADR-0052, ADR-0032).
- **Stack**: Hono on Cloudflare Workers (`apps/api`) + D1 + KV, Next.js frontend (`apps/web`) (ADR-0004, ADR-0005).
- **Data access**: Drizzle ORM over D1, not Prisma or raw-only. Migrations authored via `drizzle-kit generate`, always applied via Wrangler (never two competing migration systems). Zod (+ `drizzle-zod`) for validation. API contract types flow to the frontend via Hono's RPC client, not a hand-maintained shared package (ADR-0059).
- **API layering**: `apps/api/src` is routes → controllers → services → repositories per resource — routes are thin Hono chains, controllers own HTTP shaping/cookies, services hold Hono-free business logic and throw `utils/errors.ts` domain errors, repositories hold Drizzle queries. Route handlers must stay inline one-line arrows in the chain (Hono RPC type inference for `hc<AppType>()` depends on it). Shared technical helpers live in `utils/` (no resource/route awareness); shared TS-only types live in `types/` (one file per type, re-exported via `types/index.ts`) (ADR-0062).
- **Hosting**: frontend on Vercel, API as a Cloudflare Worker — each on its platform's free default domain for now (`*.vercel.app` / `*.workers.dev`), no custom domain yet (ADR-0063, supersedes ADR-0060's Cloudflare-only frontend hosting).
- **Design system**: Tailwind CSS + shadcn/ui. Mobile-first is the default for the *entire* product (teacher/admin panels included), not just the exam page — author for ~360–390px width first, add larger breakpoints after (ADR-0061, broadening ADR-0002).
- **Auth**: JWT returned as a bearer token (sent via `Authorization: Bearer` header, stored client-side in a non-httpOnly cookie), PBKDF2-SHA256 password hashing via Web Crypto — not bcrypt/argon2 (Workers CPU limits). JWT claims are a UI convenience only; authorization checks always hit the DB (ADR-0054, ADR-0064 — bearer token supersedes the original httpOnly-cookie transport since frontend and API are on different registrable domains).
- **CORS**: `apps/api` allows only the deployed frontend origin(s), with `Authorization` in allowed headers; no credentialed (cookie-based) CORS is needed (ADR-0064).
- **Billing**: per-course, negotiated per-student rate, manually invoiced by admin. Not exam-pack usage billing — that model is superseded (ADR-0053).
- **Question bank**: shared `Question` records linked into exams via `Exam Question Link`, not one-copy-per-exam (ADR-0055).
- **Exams lock completely at publish.** No settings/question edits after publish; unpublish only with zero attempts. Corrections go through duplication (ADR-0056).
- **Print/PDF**: `pdf-lib`-style direct generation, not a headless browser — cost guardrail (ADR-0051, ADR-0057).
- **Budget guardrail**: keep early monthly Cloudflare spend under 2,000 BDT; upgrade paid limits rather than let a live exam fail (ADR-0051).

## Repo Layout

Full directory tree with rationale: `docs/technical-design.md`. Summary:

```
apps/api/          Hono + Cloudflare Workers backend, Drizzle over D1, Zod validation
apps/web/           Next.js frontend (App Router), Tailwind + shadcn/ui, mobile-first
docs/               Product spec, ADRs, data model, glossary, build plan, technical design
bruno/              Bruno API collection for apps/api, mirrors routes/ 1:1 — Local/Dev environments
.claude/skills/     Project-specific Claude Code skills (see below)
```

## Skills

- `product-knowledge` — fast product/domain orientation; the authoritative detail is still the ADRs it links to.
- `d1-schema` — D1 table reference, migration commands and conventions, schema-level invariants (tenant scoping, one-live-attempt constraint, etc.).
- `documentation-maintenance` — the checklist for keeping ADRs/data-model/glossary/build-plan/this file in sync whenever a decision or schema changes.

Load the relevant skill before large changes in that area rather than re-deriving conventions from scratch.

## Working Through The Build Plan

Follow `docs/build-plan.md` in order — later steps assume earlier ones exist (e.g., the exam attempt flow in Step 7 assumes auth and course access from Steps 3–4). For each step: implement, `/code-review` the diff, and for anything with a runtime surface, actually exercise it against a live dev server (the `run`/`verify` skills) before calling it done. Step 7 (exam attempt-taking) is the highest-risk step in the whole plan — mobile network conditions, shuffle stability, and autosave correctness deserve their own focused pass, not a rushed one alongside other work.

## Conventions

- **Node version**: `24.14.1`, pinned in `.nvmrc`. Run `nvm use` at the start of any work in this repo — this environment does not auto-switch Node versions on `cd`, so a fresh shell defaults back to whatever `nvm alias default` is, not this project's version.
- **Package manager**: pnpm via Corepack (`packageManager` field in root `package.json`). Don't use npm/yarn.
- **Workspace commands** (run from repo root): `pnpm install`, `pnpm dev` (both apps, parallel), `pnpm dev:api` / `pnpm dev:web` (one app), `pnpm db:generate` / `pnpm db:migrate:local` (see `.claude/skills/d1-schema`).
- **Per-app commands**: `pnpm --filter api <script>` / `pnpm --filter web <script>`, or `cd` into the app. Both have `typecheck` (`tsc --noEmit`); `apps/web` has `lint` (ESLint).
- **`apps/api`**: routes chained per-resource (and mounted in `src/index.ts`) for Hono RPC type inference (see `hono` skill); route handlers stay inline and delegate to `controllers/` (ADR-0062). Env bindings come from `wrangler types`-generated `worker-configuration.d.ts` — never hand-write the `Env` interface.
- **`apps/web`**: built on Next.js 16 — this is newer than a lot of existing Next.js knowledge assumes (Turbopack by default, a `proxy.ts` file convention that replaces/renames `middleware.ts`). Check `node_modules/next/dist/docs/` for current behavior before assuming an older API, especially before Step 3's auth route guards.
- **Testing**: Vitest is set up for `apps/api` (`src/**/*.test.ts`); add coverage there as service-layer logic grows (ADR-0062 makes services easy to unit test without mocking Hono). `apps/web` has no test runner yet — add one when the first piece of frontend logic actually needs regression coverage, not preemptively.
- **Manual API testing**: `bruno/exam-taker-api` is a Bruno collection mirroring every `apps/api` route, with `Local` (`http://localhost:8787`) and `Dev` (deployed Worker) environments. Add a request there whenever a new route lands. `Login`/`Signup` auto-capture the bearer token into a runtime `{{token}}` var (`bru.setVar`, not `setEnvVar` — never write it to disk) that every other authenticated request reuses. Run headlessly via `npx @usebruno/cli run --env Local -r` from that folder.
