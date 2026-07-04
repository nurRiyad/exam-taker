# ADR 0046: Model Course Routes As Exam Topics

## Status

Accepted

## Context

Some courses may have one exam/topic, while others may contain many exam topics across a route. The course page should communicate what the teacher will test, not just list generic exams.

## Decision

Courses should support exam topics or syllabus items. Each exam topic can map to one exam or a group of exams.

Future exam topics are visible before questions are ready, showing title, short description, and date/time. Date/time is required before publishing a course route. Marks/question count stay hidden until the exam is published. Pricing is course-level in MVP, not per exam topic.

## Consequences

Benefits:

- Makes course routes clearer for students.
- Supports both small one-exam courses and larger multi-exam preparation plans.
- Improves public past/future exam display.

Open detail:

- Define the exact minimum fields for publishing a course route.
