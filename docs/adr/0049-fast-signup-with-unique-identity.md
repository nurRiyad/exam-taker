# ADR 0049: Keep Signup Fast While Enforcing Unique Identity

## Status

Accepted

## Context

Students need a low-friction way to join exams, especially on mobile. At the same time, the platform needs unique identity for rankings, weak-zone analytics, payment access, and support.

## Decision

Signup requires globally unique username, phone, and email, but the signup experience must stay fast.

Guardrails:

- Keep signup on one screen.
- Do not ask optional fields during first signup.
- Ask optional fields after the student joins the first course, not during signup.
- Make profile completion skippable.
- Remind later when the student joins a course or takes an exam.
- Avoid OTP in MVP.
- Skip email verification in MVP.
- Use Bangladesh-only phone numbers in MVP.
- Accept local `01...` phone format and store normalized `+880...`.
- Display phone numbers back to users in local `01...` format.
- Allow phone edits after signup, with password confirmation, Bangladesh-only normalization, and global uniqueness.
- Do not expose phone edit audit logs to admin/teacher in MVP.
- Show clear validation for username, phone, and email.
- Require password confirmation.
- Use password minimum length 6 with no composition rule.
- Check username availability live while typing.
- Use explicit signup uniqueness errors for usability.
- Use vague login errors for privacy/security.

Profile completion:

- Prompt after the student joins the first course.
- Students can join a course before completing optional profile fields.
- City and institution are optional free-text fields in MVP.
- City and institution cannot be required by teachers in MVP.
- Before starting any exam, username, phone, and email must be present.
- If required identity fields are missing, block exam start with a quick completion form.

## Consequences

Benefits:

- Preserves data quality and account uniqueness.
- Reduces signup drop-off.
- Keeps MVP messaging costs low.

Risks:

- Students may still find username/email/phone plus password too much.

Future:

- Measure signup drop-off during pilot exams.
