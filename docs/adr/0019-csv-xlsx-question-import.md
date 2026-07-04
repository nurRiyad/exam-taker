# ADR 0019: Include CSV Question Import In MVP

## Status

Accepted

## Context

Question entry is the biggest adoption risk. Many teachers already prepare questions through typed files or computer shops. A beautiful manual form is not enough if entering 50 questions takes too long.

## Decision

MVP includes CSV question import alongside manual question entry. XLSX import is deferred.

## Consequences

Benefits:

- Faster onboarding.
- Makes platform-assisted question entry easier.
- Matches existing typed-question workflows.
- Reduces repetitive admin work for 50-question exams.
- Keeps initial import implementation simpler than supporting both CSV and XLSX.

Risks:

- Import validation and error messages must be good.
- Bangla text and formatting need careful testing.
- Teachers may use inconsistent file formats.
- Teachers may expect XLSX because it is familiar from Excel.

Guardrails:

- Provide a downloadable template.
- Validate required fields before import.
- Show row-level errors.
- Support tags in import columns.
- Require correct answer.
- Make explanation optional.

Future:

- Add XLSX import after CSV workflow is validated.
