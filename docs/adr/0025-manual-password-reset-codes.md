# ADR 0025: Use Manual Teacher/Admin-assisted Password Reset Codes For MVP

## Status

Accepted

## Context

The MVP uses password login without OTP to avoid SMS/WhatsApp cost. Students may still forget passwords. Automated phone or WhatsApp OTP requires external messaging infrastructure and may create recurring cost.

## Decision

For MVP, use manual one-time reset codes. A teacher or platform admin can generate a short-lived reset code for a student. The code is sent manually outside the platform through the teacher's normal communication channel, such as WhatsApp or phone.

Reset policy:

- Teachers can generate reset codes for students in their courses.
- Platform admins can generate reset codes for support.
- Reset codes expire after 1 hour.

## Consequences

Benefits:

- No SMS/WhatsApp automation cost.
- Fits early teacher-assisted support model.
- Simple enough for pilots.

Risks:

- Manual support does not scale.
- Teacher/admin must send the code only to the student's registered phone/contact.
- Reset abuse is possible without rate limits and audit logs.

Guardrails:

- Reset codes must be one-time use.
- Reset codes must expire after 1 hour.
- Reset code generation must be rate-limited.
- Store who generated the reset code.
- Show teacher/admin only enough student information to identify the correct student.

Future:

- Email reset can be added later.
- Automated WhatsApp/SMS OTP should wait until revenue supports messaging cost.
