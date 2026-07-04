# ADR 0020: Use Password Login Without OTP For MVP

## Status

Accepted

## Context

OTP-based login and password recovery cost money and add operational complexity. The MVP should keep cost low while still collecting phone numbers because phone is important for teacher-student operations.

## Decision

Use simple password login for MVP. Login accepts username, phone, or email as identifier. Phone number and email are required at signup, but login does not require OTP.

Signup requires password confirmation.

Password rule:

- Minimum 6 characters.
- No letter/number composition requirement in MVP.

Email verification is skipped in MVP.

Email is used for login/future recovery only in MVP. Teacher email communication is post-MVP.

Login errors should be vague for privacy/security.

## Consequences

Benefits:

- Avoids OTP cost.
- Simpler to launch.
- Still captures phone number for payment/access communication.

Risks:

- Password reset needs a low-cost fallback.
- Students may forget passwords.

Password reset:

- MVP uses manual teacher/admin-assisted one-time reset codes as described in ADR 0025.
