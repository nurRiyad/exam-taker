---
name: documentation-maintenance
description: >
  Use this skill whenever a product or architecture decision is made or
  changed for Exam Taker, or when code changes an API, schema, auth rule, or
  workflow that the docs describe. Keeps docs/adr, docs/data-model.md,
  docs/glossary.md, docs/README.md, docs/build-plan.md, CLAUDE.md, and the
  project skills consistent with each other.
---

# Documentation Maintenance

This project runs on its docs: `docs/adr/*` are the decision history, `docs/data-model.md` mirrors the real schema, `docs/glossary.md` is the single definition of every term, and `docs/build-plan.md` is the live roadmap. Code and docs drifting apart here is worse than in most repos, because future sessions (yours and the user's) treat these docs as ground truth when deciding what to build.

## When To Use

- A new product/business decision is made (pricing, scope, a new rule) — including ones the user states in conversation, not just ones you infer from code.
- An architecture decision changes (stack, tenancy model, auth mechanism, billing mechanism).
- Code adds/changes a table, column, enum value, API route, or user-facing rule that a doc already describes.
- A previously-open question in an ADR or the glossary gets resolved.

## Update Rules

- **Never edit or renumber an existing ADR's decision.** If a decision changes, write a new ADR with the next sequential number, and edit the old ADR's `## Status` line to say `Superseded by ADR-00XX` (with a one-line note), keeping the rest of the old file intact for history. This project already does this for ADR-0001, 0006, and 0023 — follow that pattern.
- After a new/changed ADR, check whether `docs/data-model.md` needs the corresponding entity/field change, and whether `apps/api/migrations/` needs a new numbered migration (never edit an applied one — see `.claude/skills/d1-schema/SKILL.md`).
- Check `docs/glossary.md` for any term the decision touches — add, update, or mark resolved (don't delete a term that's now resolved; state the resolution, as done for "Active Student" and "Question Bank").
- Update `docs/README.md`'s "most consequential ADRs" table if the new ADR is one a future session would need to find quickly.
- Update `docs/build-plan.md` if the decision changes what a future step needs to do, or mark a step done as it's completed.
- Update `CLAUDE.md` only for decisions at the level it already documents (stack, tenancy, auth, folder layout, cross-cutting rules) — don't duplicate ADR-level detail there; link to the ADR instead.
- If a change affects patterns a skill documents (`.claude/skills/product-knowledge`, `.claude/skills/d1-schema`, or a future code-pattern skill), update that skill file too.

## Checklist Before Finishing Any Decision-Bearing Change

1. Is this decision captured in a new or updated ADR?
2. Does `docs/data-model.md` still match reality (schema and product model)?
3. Does the actual migration in `apps/api/migrations/` match `docs/data-model.md`?
4. Does `docs/glossary.md` still define every term this decision touches, accurately?
5. Does `docs/README.md` still point to the right ADRs?
6. Does `docs/build-plan.md` still describe the right next steps?
7. Does `CLAUDE.md` need a cross-cutting update, or just to keep linking out to the ADR?
8. Are all of the above internally consistent — no doc still describing the superseded behavior as current?
