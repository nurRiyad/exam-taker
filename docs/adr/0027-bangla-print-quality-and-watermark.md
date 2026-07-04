# ADR 0027: Require Polished Bangla Print/PDF With Teacher And Platform Branding

## Status

Accepted

## Context

Print export is a hybrid adoption bridge. Since many questions are Bangla, poor Bangla PDF layout would make the product look unprofessional. Print output is also a branding opportunity.

## Decision

Bangla print/PDF layout must be good from day one. Printed/PDF exams should include teacher name and platform name as watermark, header, or similar branding.

## Consequences

Benefits:

- Builds trust with teachers.
- Makes offline exams look professional.
- Promotes platform branding through printed papers.

Risks:

- Bangla font rendering and PDF layout can be technically tricky.
- Watermark must not reduce readability.

Guardrails:

- Test Bangla fonts before launch.
- Keep watermark subtle.
- Support teacher-only answer key output.

