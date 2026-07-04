# ADR 0022: Provide Official CSV/XLSX Import Template

## Status

Accepted

## Context

Teachers may not be comfortable with Excel, but platform/admin-assisted import will still be important for fast question entry. A standard template reduces chaos.

## Decision

Provide an official CSV import template from day one. XLSX can be added later.

## Consequences

Benefits:

- Faster admin-assisted onboarding.
- Easier teacher training.
- Fewer import format surprises.

Risks:

- Teachers may still send messy files.
- The platform owner may need to clean files during early pilots.

Guardrails:

- Template should include required fields, optional metadata fields, and example Bangla/English rows.
- Import should show row-level validation errors.
