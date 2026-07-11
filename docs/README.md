# Documentation Index

This is the map of every product/architecture decision made before and during implementation. When in doubt about what to build or why, start here rather than re-deriving a decision.

## Read First

- [`product-brief.md`](product-brief.md) — market, value proposition, business model exploration, risks, success metrics. The narrative "why"; not a source of current product facts (those live in `mvp-spec.md`/ADRs).
- [`mvp-spec.md`](mvp-spec.md) — the single current reference for feature-area product defaults (auth, course, exam, results, etc.) and the technical direction.
- [`glossary.md`](glossary.md) — every product term, one definition each. If a word is ambiguous, it is defined here.
- [`data-model.md`](data-model.md) — the product-level entity model. Mirrors the actual D1 schema at `apps/api/migrations/0001_init.sql`; keep both in sync.
- [`technical-design.md`](technical-design.md) — stack, project structure, local dev workflow, and production deployment in full detail.

## Supporting References

- [`flat-tags.md`](flat-tags.md) — question tagging taxonomy and CSV tag format.
- [`pilot-terms.md`](pilot-terms.md) — pilot support commitments, responsibilities, refund/downtime policy, scope limits. Its pricing section is historical (see ADR-0053 for the live billing mechanism).
- [`question-import-template.csv`](question-import-template.csv) — official CSV import template.
- [`interview-questions.md`](interview-questions.md) — the discovery interview question list (for future teacher interviews/pilot debriefs), not a source of current product facts.

## Build Plan

- [`build-plan.md`](build-plan.md) — the sequential, dependency-ordered implementation roadmap. This is what to work through step by step.

## Architecture Decision Records

All decisions in `adr/`, numbered sequentially, never renumbered or deleted — superseded ones are marked `Superseded` in their Status section and kept for history.

Currently superseded or partially superseded:

- `0001` — per-teacher template deployments → superseded by `0052` (single shared multi-tenant deployment).
- `0006` — exam-pack pricing *unit* → superseded by `0053` (per-course negotiated student-count invoicing). The student-facing pricing rules in `0006` (course-level pricing, discounts, free courses) still stand.
- `0023` — the exam-pack billing clause → superseded by `0053`. Exam duplication itself is still allowed.
- `0060` — frontend hosting on Cloudflare → superseded by `0063` (frontend on Vercel) and `0064` (cookie-domain topology → bearer token, since the project shipped on free default domains instead of a shared custom domain).
- `0054` — JWT stored in an httpOnly cookie → the cookie-transport piece is superseded by `0064` (bearer token). Hashing, signing, and expiry are unchanged.
- `0017` / `0049` — required name/email signup identity and email login → superseded by `0065` (username/phone signup, profile-later name/email, self-serve teacher signup).

Most consequential ADRs to read before touching related code:

| Area | ADR |
|---|---|
| Tenancy / deployment | `0052` |
| Billing / invoicing | `0053` |
| Auth (JWT, password hashing, bearer-token transport) | `0054`, `0064` |
| Question bank / reuse | `0055`, `0024` |
| Exam publish lock | `0056` |
| Print/PDF | `0027`, `0057` |
| Course route publish rule | `0046`, `0058` |
| Exam attempt mechanics (shuffle, autosave, auto-submit, one live attempt) | `0009`, `0033`, `0036`–`0041` |
| Result/leaderboard | `0010`, `0018`, `0021`, `0044`, `0045` |
| Weak-zone visibility | `0028`, `0032` |
| Signup/identity | `0065`, `0020`, `0025`, `0048` |
| Budget guardrail | `0051` |
| Data access / ORM / validation | `0059` |
| Backend code layering (routes/controllers/services/repositories) | `0062` |
| Frontend hosting / domain topology | `0063` (supersedes `0060`) |
| Design system / mobile-first scope | `0061`, `0002` |

For the full list, browse `adr/` in numeric order — each file name describes its own decision.

## Keeping This Consistent

Whenever a new product or architecture decision is made: write a new ADR (never edit or renumber an old one — mark it `Superseded` instead), then update `data-model.md`, `glossary.md`, and this index if the decision changes the map. See `.claude/skills/documentation-maintenance/SKILL.md` for the full checklist.

Each product fact should live in exactly one place: `mvp-spec.md` for current feature-area defaults, the relevant ADR for the decision and its reasoning. `product-brief.md` and `interview-questions.md` are narrative/discovery documents, not specs — don't re-add a "current defaults" list to either; that's how this drifted out of sync before (fixed 2026-07-11).
