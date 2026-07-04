---
name: product-knowledge
description: >
  Product and domain knowledge for Exam Taker — a mobile-first exam platform
  for Bangladesh coaching teachers running MCQ exams. Covers roles, MVP scope,
  key defaults, tenancy, billing, and where to find the authoritative decision
  for any given behavior. Use when implementing or reviewing any feature to
  confirm the expected behavior before writing code.
---

# Exam Taker Product Knowledge

Full detail always lives in `docs/`. This skill is an index and a fast-orientation summary, not a replacement — when a behavior matters, confirm it in `docs/README.md` and the ADR it points to before assuming this summary is complete or still current.

## What It Is

A mobile-first exam platform that lets Bangladesh coaching teachers publish branded pages, sell or offer courses, schedule MCQ exams, run live timed attempts, publish rankings, and give students weak-zone analysis — without each teacher building their own edtech product. First wedge: replacing printed/offline MCQ exam operations for BCS/government-job prep.

## Roles

- **Platform admin**: creates teacher tenants, generates reset codes, read-only support views (no impersonation), generates/tracks invoices.
- **Teacher**: owns one tenant. Creates courses, routes (exam topics), exams, questions, approves student payment/access, sets the negotiated per-student billing rate.
- **Student**: one global account joins multiple teachers' courses, takes exams, sees results/rank/weak-zones.

## Architecture At A Glance

- **One shared multi-tenant deployment.** Not separate deployments per teacher. Every teacher-or-student-scoped query must filter by `tenant_id`/course membership — this is a hard security requirement (ADR-0052, ADR-0032).
- **Stack**: Hono on Cloudflare Workers + D1 (relational) + KV (cache/session-adjacent, never source of truth for submissions/payments), Next.js frontend (ADR-0004, ADR-0005).
- **Auth**: JWT in an httpOnly cookie, PBKDF2-SHA256 password hashing (not bcrypt — Workers CPU limits). JWT claims are a UI convenience; real authorization checks hit the DB (ADR-0054).
- **Data access**: Drizzle ORM over D1 (not Prisma, not raw-only), migrations generated from a Drizzle schema but always applied via Wrangler. Zod + `drizzle-zod` for validation. Frontend gets API types via Hono's RPC client, no separate shared-types package (ADR-0059).
- **Frontend**: Next.js + Tailwind + shadcn/ui, hosted on Cloudflare via OpenNext, on an apex/`api.` subdomain split with a shared cookie domain (ADR-0060). Mobile-first is a whole-product default, not just the exam page — 99% of users are on mobile (ADR-0061).
- **Budget guardrail**: stay under 2,000 BDT/month during early validation; upgrade Cloudflare limits rather than let a live exam fail (ADR-0051).

## Billing Model (do not confuse with student-facing course price)

Platform bills the teacher per course, not per exam-pack. Admin sets a negotiated `price_per_student_bdt` per course, then manually generates an invoice snapshotting the approved-student count × rate (with a manual adjustment field), tracked `draft → sent → paid/void`. No automatic recurring billing, no usage-limit enforcement in MVP (ADR-0053). This replaced the originally-planned exam-pack pricing (ADR-0006/0023, now superseded) — don't build pack/usage-counter logic.

## Course/Exam Structure

Course → one or many Exam Topics (route items, need title/short-description/date before publish, ADR-0058) → each topic maps to one or more Exams. Course pricing is course-level only, with optional percentage discount (date-bounded, new-students-only, ADR-0006).

## Question Bank

Questions are a shared, reusable bank (`Question`), not owned 1:1 by an exam. An exam includes questions via `Exam Question Link`. `reuse_scope` is `platform_reusable` (default, no owning tenant) or `teacher_private` (owning tenant, cannot be linked cross-tenant) (ADR-0024, ADR-0055).

## Exam Mechanics (the highest-risk surface — see Step 7 of `docs/build-plan.md`)

- Questions/options always shuffled, order stable per attempt (ADR-0033).
- One live attempt per student per exam, DB-enforced; unlimited teacher-configured mock retries after live results release (ADR-0009, ADR-0039).
- Configurable per exam: negative marking, answer-change policy, autosave, mock mode/retry limit, result release mode/timing. Defaults: 50Q/50min, autosave on, answer-change allowed, negative marking off, result release automatic 5 minutes after exam end (ADR-0013, ADR-0016, ADR-0037).
- Internet drop does not pause the timer; auto-submit on timeout; submit confirmation shows unanswered count; leave/refresh warning (ADR-0036, ADR-0038, ADR-0040, ADR-0041).
- **An exam is fully locked at publish.** No settings/question edits after publish. Unpublish only allowed with zero attempts. Fixing a published, attempted exam means duplicating into a new exam (ADR-0056).

## Results, Leaderboard, Weak Zones

- Result page: score, rank, correct answers. No percentile/average, no teacher pre-release preview, no post-release recalculation (ADR-0010, ADR-0045).
- Full named leaderboard; tied scores share rank, shorter completion time is secondary display order (ADR-0018, ADR-0021).
- Weak-zone report updates after every live attempt; mock attempts only count if the student explicitly opts in per attempt (unchecked by default, student-controlled only) (ADR-0028). Visibility: student sees own only, teacher sees own tenant's enrolled students, admin sees all (ADR-0032).

## Identity, Signup, Language

- One-screen signup: name, username (immutable, unique, letter-first), phone (BD-only, `01...` shown / `+880...` stored), email, password (min 6 chars) + confirmation. City/institution optional forever, never teacher-required (ADR-0017, ADR-0049).
- English-first UI, i18n structure from day one with empty Bangla placeholders; Bangla required for question/answer/explanation content and PDF output regardless (ADR-0047).
- BDT-only currency.

## Explicitly Out Of MVP Scope

Video/live classes, native apps, proctoring, image-based MCQs / OCR import, teacher announcements/messaging, teacher result export, admin impersonation, student self-deletion, result recalculation after release. Full list: `docs/product-brief.md` Non-goals section.

## When You're Not Sure

Grep `docs/adr/` for the relevant keyword, or check `docs/README.md`'s table of "most consequential ADRs by area." If a decision seems to conflict with this summary, the ADR wins — this file can drift; the ADRs are the source of truth.
