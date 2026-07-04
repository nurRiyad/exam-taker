# ADR 0014: Store Rich Question Metadata From Day One

## Status

Accepted

## Context

Weak-zone analysis depends on question metadata. If questions do not have topic tags, the platform can show score and rank but cannot explain what a student is weak in. The founder also wants tags for exam type and whether a question appeared in previous exams.

## Decision

Questions should support rich metadata from day one.

Initial metadata:

- Topic tag.
- Subject/category tag.
- Exam type tag.
- Previous-exam appearance tag.
- Year.
- Post name.
- Institution.
- Optional source details.

## Consequences

Benefits:

- Enables weak-zone analysis.
- Makes question bank reuse more powerful.
- Helps teachers build exams matching real government-job patterns.

Risks:

- Detailed tagging increases question-entry time.
- Bad tags will produce misleading weak-zone analysis.

Guardrails:

- Start with a controlled set of top-level tags.
- Allow optional deeper tags.
- Make tagging fast during question entry.

Initial top-level subjects:

- Bangla.
- English.
- Math.
- General Knowledge.
- ICT.
