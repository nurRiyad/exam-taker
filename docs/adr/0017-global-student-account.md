# ADR 0017: Use Global Student Accounts Across Teachers

## Status

Superseded by ADR-0065 for required signup identity fields. Global student accounts and immutable unique usernames still stand.

## Context

A student may join multiple teachers' courses. Creating separate student accounts per teacher would make student experience worse and make cross-course analytics harder later.

## Decision

Use one global student account that can join multiple teachers' courses.

Required student identity:

- Name.
- Globally unique username.
- Phone.
- Email.

Optional profile fields:

- City.
- Institution.

Username is created during signup and cannot be edited in MVP.

Username rules:

- Globally unique.
- Starts with a letter.
- Then may contain letters, numbers, and underscores.
- Minimum length is 3.

Phone and email are also globally unique.

Signup should stay low-friction: one screen, no optional fields during first signup.

## Consequences

Benefits:

- Better student experience.
- Enables future cross-course dashboard.
- Reduces duplicate accounts.

Risks:

- Teachers may worry about platform ownership of student relationships.
- Data visibility rules must ensure teachers only see students connected to their courses.
