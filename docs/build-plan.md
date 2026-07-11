# Build Plan

Sequential, dependency-ordered implementation roadmap. Work through these in order — each step assumes the previous ones exist. Steps are sized to be one to a few focused Claude Code sessions each, not one-shot.

For each step: implement, run `/code-review`, and for anything with a runtime surface (an API endpoint, a page, a flow a user can click through), actually drive it with the `run`/`verify` skill against a live dev server before calling it done — type-checks and unit tests confirm correctness, not that the feature works.

## Step 0 — Close product/architecture gray areas — DONE

ADR-0052 through ADR-0058, plus updates to `data-model.md` and `glossary.md`. See `docs/README.md`.

## Step 1 — Data model → D1 schema — DONE

`apps/api/migrations/0001_init.sql`, seeded `apps/api/wrangler.jsonc`. Apply locally once Step 2 exists: `wrangler d1 migrations apply exam-taker-db --local`.

## Step 2 — Repo and infra scaffold — DONE (local dev only; real Cloudflare resources/domain still open)

What's done: pnpm workspace root, `apps/api` (Hono skeleton exporting `AppType`, `src/db/schema.ts` mirroring `migrations/0001_init.sql`, `drizzle.config.ts`, `/health` route querying D1 through Drizzle), `apps/web` (Next.js App Router + Tailwind, `next.config.ts` rewrite proxying `/api/*` to the API dev server), `.nvmrc` pinning Node `24.14.1`. Verified end to end: `pnpm dev` runs both, local D1 migration applied, homepage renders a real server-side call to the API, and the browser-facing `/api/*` proxy also reaches it. Full shape: `docs/technical-design.md`.

Deliberately deferred (not needed for local dev, tracked here so they aren't forgotten):

- ~~shadcn/ui not initialized yet~~ — done in Step 3 (`base-nova`/Base UI style).
- ~~`drizzle-kit generate` not exercised yet~~ — done: `migrations/0002_drizzle_baseline.sql` establishes the journal/snapshot baseline (every statement is `IF NOT EXISTS`, so it safely no-ops against the already-migrated local D1); a follow-up `db:generate` confirms zero schema drift. Real migrations resume at `0003`. See `.claude/skills/d1-schema/SKILL.md`.
- Real Cloudflare resources: `wrangler d1 create exam-taker-db`, `wrangler kv namespace create CACHE`, fill the placeholder IDs into `apps/api/wrangler.jsonc`, set `JWT_SECRET` via `wrangler secret put`. **Needs the project owner's own Cloudflare account** (`wrangler login`) — still open.
- Hosting: create a Vercel project for `apps/web` and deploy `apps/api` as a Cloudflare Worker, each on its free default domain (`*.vercel.app`, `*.workers.dev`) — no custom domain purchase needed to launch (ADR-0063, supersedes ADR-0060's OpenNext/Cloudflare Pages choice). **Needs Vercel/Cloudflare account access from the project owner** — still open.
- Auth transport: bearer token instead of an httpOnly cookie, since frontend and API are on different registrable domains (ADR-0064, supersedes ADR-0054's cookie-transport piece).
- CI/CD: GitHub Actions for lint/format/test on PR, plus API migrate+deploy on merge to `main` — brought forward from Step 13 to now, per explicit project-owner request (ADR-0063). Frontend deploy automation is Vercel's own Git integration, no Actions workflow needed for that half.
- `apps/web` scaffolded on Next.js 16 (Turbopack by default) — newer than what most existing Next.js knowledge assumes. It introduces a `proxy.ts` file convention that replaces/renames `middleware.ts`; check `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` before building the Step 3 auth route guards so they use the current convention, not the old one.

## Step 3 — Auth vertical slice

- Signup (one screen, username/phone/password + confirmation, student/teacher role), PBKDF2 hashing, JWT issued as a bearer token (ADR-0054, ADR-0064, ADR-0065).
- Login (username/phone + password), vague error messages (ADR-0020, ADR-0065).
- Manual reset-code flow: teacher/admin generates a code, student redeems it (ADR-0025).
- Role-based route guards (student/teacher/admin) enforced server-side against the DB, not JWT claims alone.
- Exit criteria: a student can sign up, log out, log back in, and recover via a reset code end to end in the browser.

## Step 4 — Tenant, course, and access workflow

- Teacher/tenant creation (self-serve teacher signup creates the initial tenant; admin tenant creation remains available for support), teacher branding fields (logo/banner/color/picture).
- Course CRUD, course publish validation (ADR-0058).
- Course join flow (login-required, ADR-0048), payment access requests, one-by-one teacher approval (ADR-0011, ADR-0026).
- Exit criteria: a teacher creates a course and publishes a route with at least one dated exam topic; a student joins, requests access, and a teacher approves it.

## Step 5 — Billing

- `course_billing_rates` admin UI (set the negotiated per-student rate for a course).
- Invoice generation (snapshot student count + rate, manual adjustment field), `draft → sent → paid/void` lifecycle (ADR-0053).
- Exit criteria: admin generates an invoice for a course with enrolled students and manually marks it paid.

## Step 6 — Question bank and exam authoring

- `Question` CRUD (manual entry) + tagging (flat tags, ADR-0050) + CSV import against the official template.
- `Exam` CRUD, linking questions via `Exam Question Link`, publish validation (every question needs an answer, ADR-0030) and publish lock (ADR-0056).
- Exam duplication (ADR-0023): duplicate links for reusable questions, copy-then-link for teacher-private ones (ADR-0055).
- Exit criteria: a teacher imports 50 questions via CSV, assembles an exam from them, and publishes it; publishing a second time or editing after publish is blocked.

## Step 7 — Exam attempt-taking flow (highest risk — give this its own focused pass)

- Shuffled question/option order, stored stable per attempt (ADR-0033).
- Autosave, answer-change policy, connection indicator, leave-page warning (ADR-0037, ADR-0038, ADR-0040).
- Timer, auto-submit on timeout, submit confirmation with unanswered count (ADR-0036, ADR-0041).
- One live attempt per student per exam (DB-enforced via the partial unique index already in the schema).
- Exit criteria: actually take a full mock exam on a throttled mobile viewport in the browser — start, answer some, refresh mid-attempt (order and saved answers survive), let the timer expire and confirm auto-submit.

## Step 8 — Results and leaderboard

- Scoring (negative marking per exam), tie rule (same rank, completion time as secondary order, ADR-0021).
- Result release timing (automatic 5-minute default or manual, ADR-0010), leaderboard (name/score/rank only, ADR-0018).
- Exit criteria: after an exam ends, results release on schedule and the leaderboard renders correctly for a tied-score scenario.

## Step 9 — Mock attempts and weak-zone analytics

- Mock mode toggle, retry limits, mock results shown immediately (ADR-0009, ADR-0039, ADR-0042).
- Mock analytics consent checkbox, unchecked by default, student-controlled only (ADR-0028).
- Weak-zone snapshot computation after each live attempt (and consented mock attempts), scoped visibility (student/teacher/admin, ADR-0032).
- Exit criteria: a student's weak-zone report updates after a live attempt and is unaffected by a mock attempt taken without consent.

## Step 10 — Print/PDF export

- `pdf-lib` question-paper and answer-key templates with embedded Bangla font, teacher/platform watermark (ADR-0027, ADR-0057).
- Exit criteria: export a real Bangla-heavy exam to PDF and visually confirm layout/watermark quality.

## Step 11 — Public teacher and course pages

- Public teacher page (branding, course list), public past-exam list with locked details for non-enrolled users and the locked-exam CTA (ADR-0044).
- Exit criteria: log out and browse a teacher's public page as an anonymous visitor; locked content behaves per ADR-0044.

## Step 12 — Admin support tooling

- Read-only admin views across tenants (ADR-0015), reset-code generation for support, print/export access for support.
- Exit criteria: admin can look up a specific student/teacher's state and generate a reset code without being able to act as them.

## Step 13 — Pilot hardening pass

- Rate-limit reset-code generation (ADR-0025), verify budget guardrail assumptions against real Cloudflare **and Vercel** usage (ADR-0051, ADR-0063 — Vercel likely needs a paid plan, re-check the guardrail once real invoices exist), mobile QA pass on a real low-end device/slow connection, error-message audit (no leaking of internal state).
- ~~CI/CD automation~~ — done ahead of schedule; see Step 2's CI/CD note and ADR-0063.
- Exit criteria: ready to run the first real pilot exam with the founder available for support, per `pilot-terms.md`.
