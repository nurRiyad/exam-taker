# ADR 0065: Username/Phone Signup And Self-Serve Teacher Accounts

## Status

Accepted

## Context

The original auth slice required name, username, phone, email, password, and confirmation on first signup. That created too much upfront friction for mobile users and made teacher onboarding depend on admin-created tenant setup.

The product now needs a faster first signup and a direct way for a teacher to open an account. Name and email still matter for profile quality, but they do not need to block account creation.

## Decision

Signup requires only:

- Username.
- Bangladesh phone number.
- Password.
- Password confirmation.
- Account role: student or teacher.

Name and email are profile-completion fields after signup. They are not shown on the signup form and are not required before the user can authenticate.

Login and reset-code redemption accept username or phone only. Email is no longer an authentication identifier.

Teachers may self-sign up. When a user selects teacher during signup, the backend creates:

- A teacher-role user.
- A tenant for that teacher.
- An owner `teacher_memberships` row linking the user to the tenant.

The tenant's initial name comes from the username. The tenant slug is derived from the username by lowercasing and replacing underscores with hyphens, so it satisfies the tenant slug rule.

Admin accounts remain out-of-band.

Implementation note: the current D1 schema still has physical `users.name` and `users.email` columns as `NOT NULL` from the initial migration. Public signup writes system placeholders into those columns and API responses expose them as `null` until profile completion is implemented. This avoids a risky parent-table rebuild across many foreign-keyed tables while preserving the user-facing rule that name and email are optional at signup.

## Consequences

Benefits:

- Faster mobile signup.
- Teacher onboarding no longer blocks on admin tenant creation.
- Email can be collected later when the user is ready to complete their profile.

Risks:

- Placeholder profile values are an implementation detail that future profile-edit work must replace cleanly.
- Existing users with real email addresses can keep them, but email no longer works for login.
- Teacher signup creates user, tenant, and membership in multiple statements; prechecks reduce conflicts, but a rare mid-flow failure may require cleanup until a stronger transaction strategy is introduced.

Future:

- Add profile completion/editing for name and email.
- Consider a later migration to make `users.name` and `users.email` truly nullable if D1 supports a safe path or if the schema is rebuilt in a controlled maintenance window.