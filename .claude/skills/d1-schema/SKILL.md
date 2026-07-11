---
name: d1-schema
description: >
  Cloudflare D1 (SQLite) schema, migration conventions, and table reference
  for Exam Taker's apps/api. Use when adding tables/columns, writing
  migrations, or writing queries against the database.
---

# D1 Schema Guide

Product-level model lives in `docs/data-model.md`; this file documents the actual schema and how to work with it. Keep both in sync when either changes.

## Conventions

- **IDs**: `TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16))))` — app can omit `id` on insert and read it back, or supply its own for idempotency (e.g., a client-generated attempt-submit key).
- **Timestamps**: `TEXT`, ISO-8601, default `datetime('now')`. No native SQLite datetime type.
- **Booleans**: `INTEGER` with a `CHECK (col IN (0, 1))`.
- **Enums/status fields**: `TEXT` with a `CHECK (col IN (...))`, not a separate lookup table — matches this project's flat, low-ceremony data model.
- **Money**: `REAL` BDT amounts. Known tradeoff (float precision); acceptable at MVP scale. If invoice reconciliation ever shows drift, migrate money columns to integer minor units.
- **Tenant scoping**: any query touching teacher- or student-owned data must filter by `tenant_id` or the relevant course/enrollment join. This is a security requirement (ADR-0032), not a style preference — there is no separate database per tenant to fall back on (ADR-0052).

## Migrations

D1 migrations are **forward-only** — there is no down migration. Never edit an already-applied migration file; add a new numbered one instead.

Query access uses Drizzle ORM (`drizzle-orm/d1`), not raw bindings or Prisma (ADR-0059). `apps/api/src/db/schema.ts` is the TypeScript mirror of the schema — but Wrangler's migration files remain the only thing that actually touches the database. `drizzle-kit` only diffs `schema.ts` to generate SQL; it is never pointed at D1 directly.

Migration `0001_init.sql` was hand-written to seed the initial schema and is now applied/frozen. `0002_drizzle_baseline.sql` is drizzle-kit's first-ever `generate` run — it establishes the `migrations/meta/` snapshot/journal baseline that future diffs are computed against. Every statement in it is `CREATE TABLE IF NOT EXISTS` / `CREATE UNIQUE INDEX IF NOT EXISTS` on purpose: it's not meant to actually create anything (0001 already did, including the CHECK constraints and partial unique index schema.ts deliberately omits — see its header comment), just to safely no-op on any database, fresh or already-migrated. **From `0003` onward**, generate real migrations from `schema.ts` instead of hand-writing SQL:

```bash
# 1. Edit apps/api/src/db/schema.ts to reflect the new/changed table(s)

# 2. Generate the next numbered SQL migration from the schema diff
pnpm --filter api db:generate     # runs `drizzle-kit generate`, writes into apps/api/migrations/

# 3. Review the generated SQL before applying — drizzle-kit diffs can occasionally
#    choose a destructive strategy (e.g. drop+recreate) for a column change that a
#    hand-written ALTER would have done non-destructively. Edit the generated file
#    if needed before it's applied; only rewrite it before the first apply, never after.

# 4. Apply pending migrations locally
wrangler d1 migrations apply exam-taker-db --local

# Apply to the real remote D1 instance
wrangler d1 migrations apply exam-taker-db --remote

# One-off query against local D1 during development
wrangler d1 execute exam-taker-db --local --command "SELECT * FROM users LIMIT 5"

# Browse/edit local DB state in a GUI instead of one-off queries
pnpm --filter api db:studio     # drizzle-kit studio, opens https://local.drizzle.studio
```

`db:studio` needs `better-sqlite3`'s native binary (only used for this local tool, never shipped to Workers) — `apps/api/drizzle.config.ts` locates wrangler's local D1 sqlite file itself, so no manual path configuration is needed.

Migration files live in `apps/api/migrations/`, numbered sequentially (`0001_init.sql`, `0002_drizzle_baseline.sql`, `0003_...sql`).

## Table Reference

| Table | Purpose | Key relationships |
|---|---|---|
| `tenants` | One row per teacher/coaching brand | — |
| `users` | Global accounts (student/teacher/admin), globally unique username/phone; email is profile-later and currently stored with an internal placeholder until completed | — |
| `teacher_memberships` | Links a user to a tenant with owner/staff role | `tenants`, `users` |
| `courses` | Teacher-created course, student-facing price/discount | `tenants` |
| `course_enrollments` | Student's join + access state for a course | `courses`, `users` |
| `payment_access_requests` | Student-submitted transaction ID pending teacher review | `courses`, `users` |
| `course_billing_rates` | Platform's negotiated per-student rate for a course (ADR-0053) | `courses`, `users` |
| `invoices` | Platform-to-teacher bill, snapshotted at generation (ADR-0053) | `courses`, `tenants`, `users` |
| `exam_topics` | Route/syllabus items under a course | `courses` |
| `exams` | Scheduled MCQ exam; **locked at publish** (ADR-0056) | `exam_topics`, `courses`, `tenants` |
| `questions` | Shared reusable question bank (ADR-0055) | `tenants` (nullable) |
| `exam_question_links` | Join: which bank questions are in which exam, with order | `exams`, `questions` |
| `question_tags` | Flat tags on a bank question | `questions` |
| `exam_attempts` | One row per live/mock attempt; DB-enforced one-live-attempt-per-student via partial unique index | `exams`, `users` |
| `attempt_items` | Per-question state for an attempt, with content snapshotted at attempt time | `exam_attempts`, `exam_question_links` |
| `weak_zone_snapshots` | Aggregated accuracy per student/course/subject/tag | `users`, `tenants`, `courses` |
| `reset_codes` | Manual one-time password reset codes, 1-hour expiry | `users` |

## Notable Constraints Already In The Schema

- `exam_attempts`: partial unique index `(exam_id, student_user_id) WHERE attempt_type = 'live'` enforces one live attempt per student per exam at the DB level — don't re-implement this check only in application code, but don't rely on it alone either (surface a clean error, don't let the constraint violation bubble up raw).
- `questions`: `CHECK (reuse_scope = 'platform_reusable' OR tenant_id IS NOT NULL)` — a teacher-private question always has an owning tenant.
- `users`: `CHECK (length(username) >= 3 AND username GLOB '[a-zA-Z]*')` — first-character-is-a-letter and minimum length are DB-enforced; full charset validation (letters/numbers/underscores only) still belongs in the application layer since SQLite `CHECK`/`GLOB` can't express it cleanly.

## When The Product Model Changes

If a new ADR changes an entity (new field, new table, new relationship), update in this order: `docs/data-model.md` → `apps/api/src/db/schema.ts` → a generated migration here (see above) → this table reference. Don't let any of these four drift from the others.
