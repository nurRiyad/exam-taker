# ADR 0028: Update Student Weak-zone Analysis After Every Exam

## Status

Accepted

## Context

Weak-zone analysis is a key student value. The founder wants students to always see weak zones and have them update after every exam.

## Decision

Student weak-zone analysis is visible from the first exam and updates after each live exam attempt.

Mock attempts can be included in weak-zone analysis only when the student explicitly checks a consent box before starting the mock attempt. The consent checkbox is unchecked by default. Only the student controls this decision; teachers can view but not edit it.

Visibility:

- Student sees only their own weak-zone report.
- Teacher sees weak-zone reports for students joined to that teacher's courses.
- Platform admin can see all weak-zone reports.
- Teacher MVP view is individual student details only; class aggregate can come later.

## Consequences

Benefits:

- Immediate student value.
- Reinforces repeated exam participation.
- Makes detailed question tags valuable from day one.
- Lets students decide whether practice/mock attempts should affect their analytics.

Risks:

- One exam may produce noisy weak-zone results.
- Bad question tags can mislead students.

Guardrails:

- Label early analysis as based on limited data when attempts are few.
- Use topic/subject tags consistently.
- Do not silently include mock attempts in weak-zone analysis.
- Keep mock analytics consent unchecked by default.
- Do not allow teachers to override a student's mock analytics consent.
