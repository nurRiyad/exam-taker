# ADR 0047: English-first I18n-ready And BDT-only MVP

## Status

Accepted

## Context

The first market is rural and semi-urban Bangladesh government-job preparation. Students mostly use mobile phones, and the teacher/student workflow is local.

## Decision

The MVP launches with English UI first and BDT-only pricing.

The product should be built so Bangla can be added easily later. Translation/i18n structure should exist from day one, including empty Bangla placeholders. Admin UI remains English-only. Teacher and student UI should support Bangla later.

Bangla content support is still required for:

- Questions.
- Answers.
- Explanations.
- Print/PDF output.

BDT is the only supported currency in MVP.

## Consequences

Benefits:

- Faster first release.
- Keeps admin tooling simple.
- Preserves a path to Bangla teacher/student UI.
- Keeps currency complexity low.

Tradeoffs:

- Bangla UI is deferred even though Bangla question/content support is required.
- Multi-currency markets are deferred.

Future:

- Add Bangla teacher/student UI after core workflow is validated.
- Add other currencies only after the Bangladesh government-job prep wedge is validated.
