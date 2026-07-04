# ADR 0055: Shared Question Bank With Per-exam Links

## Status

Accepted

## Context

ADR-0024 decided that questions are reusable by the platform by default, with a `reuse_scope` marking teacher-private exceptions. The glossary defines "Question Bank" as a reusable collection of questions. However, `data-model.md` currently attaches question content directly to a single `exam_id` (`Exam Question`), with no shared record a second exam could point back to. As written, "reuse" would mean copying row content, and `reuse_scope` sits on a row nothing else can actually share.

## Decision

Split the current `Exam Question` entity into two entities:

- `Question`: the reusable bank record. Holds question text, options, correct answer, explanation, subject/tags, exam-name/year/post/institution/source metadata, `reuse_scope` (`platform_reusable` or `teacher_private`), and an owning `tenant_id` (nullable for platform-owned/shared questions).
- `Exam Question Link`: a join row of `exam_id`, `question_id`, `sort_order`, representing that a question is included in a specific exam.

Reuse and duplication behavior:

- Reusing a `platform_reusable` question into a new exam creates a new `Exam Question Link` pointing at the existing `Question` row. No content is copied.
- Duplicating an exam duplicates its `Exam Question Link` rows. For `platform_reusable` questions, the duplicate links point at the same `Question` rows. For `teacher_private` questions, the underlying `Question` row is copied too, since a private question cannot be shared even by reference outside its owning tenant.
- CSV import creates new `Question` rows (with `reuse_scope` taken from the `reuse_scope` column) and links them into the target exam in one step.

## Consequences

Benefits:

- Makes ADR-0024's reuse model real instead of a column with no shared target.
- Question bank search/browse across a teacher's or the platform's past exams becomes a straightforward query instead of a hypothetical.
- Avoids duplicating full question text/options across every exam that reuses the same question, which matters once teachers start reusing prior-exam questions at scale.

Tradeoffs:

- Slightly more schema/query complexity than a single flat table (one join instead of a direct column read).
- Editing a shared `Question` row could affect multiple exams; MVP mitigates this the same way ADR-0016 already requires for scoring settings: `Attempt Item` stores the question content actually shown at attempt time (text/options/correct option as presented), so a later edit to the bank `Question` never changes a historical attempt's record.

## Follow-up

- Update `docs/data-model.md` to reflect `Question` + `Exam Question Link` in place of the current `Exam Question` entity.
