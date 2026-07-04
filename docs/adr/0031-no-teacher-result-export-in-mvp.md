# ADR 0031: Do Not Give Teachers Result Export In MVP

## Status

Accepted

## Context

Teachers may eventually need result export, but exporting all student results creates product scope, privacy, and data ownership questions. For MVP, the focus is in-platform ranking, results, and weak-zone analysis.

## Decision

Teachers cannot export all student results to CSV/XLSX in MVP.

## Consequences

Benefits:

- Keeps MVP smaller.
- Keeps student analytics inside the product.
- Avoids early data ownership confusion.

Risks:

- Some teachers may ask for exports.
- Manual support may be needed for special cases.

Future:

- Platform admin export may be considered separately for operations.
- Teacher export can be added later as a paid/controlled feature.

