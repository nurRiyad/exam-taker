# ADR 0026: Approve Student Payment Requests One By One In MVP

## Status

Accepted

## Context

Students pay teachers outside the platform and request access with a transaction ID. The teacher manually verifies payment.

## Decision

For MVP, teachers approve payment/access requests one by one. Bulk approval is deferred.

## Consequences

Benefits:

- Simpler MVP.
- Reduces accidental mass approval.
- Matches manual payment verification.

Risks:

- Slow for large courses.
- 300-student teachers may feel friction.

Future:

- Bulk approve can be added after pilot usage shows the exact bottleneck.

