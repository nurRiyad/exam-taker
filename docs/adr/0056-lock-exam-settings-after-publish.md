# ADR 0056: Lock Exam Settings And Questions At Publish

## Status

Accepted

## Context

ADR-0016 requires grading settings to be stored with each submission so historical results do not change if exam settings are edited later. ADR-0030 blocks publishing unless every question has an answer. Neither ADR says whether a teacher can still edit a published exam's settings, questions, or answers before or during the live window. Without a clear rule, a teacher could change negative marking or a question's correct answer mid-live-window, which would be worse than not allowing edits at all.

## Decision

An exam becomes fully locked the moment it is published:

- Exam settings (duration, question count, negative marking, shuffle, answer-change policy, autosave, result release mode) cannot be edited after publish.
- Questions, options, correct answers, and explanations attached to that exam (via `Exam Question Link`, ADR-0055) cannot be added, removed, or edited after publish.
- A published exam can only be reverted to draft (unpublished) if it has zero attempts (live or mock) recorded against it. Once any attempt exists, the exam cannot be unpublished or edited at all.
- If a teacher needs to fix a mistake in a published exam that already has attempts, the supported path is duplicating the exam (ADR-0023) into a new draft, fixing it there, and publishing the corrected copy as a new exam.

## Consequences

Benefits:

- Removes any ambiguity about whether mid-live-window edits are possible; they are not.
- Keeps ADR-0016's grading-settings-per-submission guarantee trivially true, since settings cannot change after publish at all.
- Matches the spirit of ADR-0045 (no result recalculation after release): if you cannot edit a published exam, you cannot create the kind of inconsistency that recalculation was meant to fix.

Tradeoffs:

- A typo discovered before the live window starts still requires a full duplicate-and-republish cycle rather than a quick in-place fix, even though no student has attempted it yet.
- Draft-with-zero-attempts unpublish/edit is allowed, which means a teacher could still publish, immediately notice a mistake before anyone attempts it, unpublish, fix, and republish. This is accepted as a reasonable pressure-relief valve since it cannot affect any real attempt.

## Follow-up

- If pilot feedback shows the zero-attempts unpublish window is too tight in practice (for example, a mistake noticed after one early test-taker before the real window opens), reconsider a narrower "no attempts yet AND before scheduled `starts_at`" edit window instead of a full duplicate cycle.
