# ADR 0045: No Result Recalculation After Release In MVP

## Status

Accepted

## Context

If a teacher discovers a wrong answer after an exam, recalculating scores and ranks requires careful audit, student communication, and result history handling.

## Decision

Teachers cannot edit answers and recalculate released results in MVP.

## Consequences

Benefits:

- Keeps result system simpler.
- Avoids disputes from changing ranks after release.
- Keeps MVP focused.

Risks:

- A wrong answer in a published exam cannot be corrected cleanly through the product.

Future:

- Add pre-release answer correction or audited recalculation after core workflow is stable.

