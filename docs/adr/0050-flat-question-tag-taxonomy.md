# ADR 0050: Use Flat Tags For Question Taxonomy

## Status

Accepted

## Context

Government-job preparation questions can belong to many dimensions: subject, topic, exam name, year, post, institution, and previous-exam appearance. A strict tree would be too rigid.

## Decision

Use flat tags instead of a strict tree taxonomy. Questions can have many tags.

Initial top-level subjects remain:

- Bangla.
- English.
- Math.
- General Knowledge.
- ICT.

## Consequences

Benefits:

- Flexible question classification.
- Easier import from messy teacher/admin data.
- Supports future analytics and question reuse.

Risks:

- Tags can become inconsistent without curation.

Guardrails:

- Start with controlled common tags where possible.
- Allow admin cleanup/merge later.

