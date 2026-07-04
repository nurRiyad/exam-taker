# ADR 0008: Teacher-managed Payment Status For MVP

## Status

Proposed

## Context

The first version should avoid payment gateway complexity. In the current market, teachers can collect payment directly from students through their existing process. The platform still needs to control access to paid exams or courses.

## Decision

For MVP, students pay the teacher outside the platform. The teacher then marks the student's payment/access status inside the platform.

## Consequences

Benefits:

- Avoids payment gateway setup in the first version.
- Matches existing teacher-student payment relationships.
- Keeps platform scope smaller.
- Lets the product validate exam workflow before payment automation.

Risks:

- Manual payment updates may become tedious for teachers.
- Students may claim they paid before teacher confirms it.
- Support issues may arise around access delays.

Required MVP features:

- Student can request access to a course.
- Teacher can approve or block access.
- Teacher can see pending students.
- Student sees a clear pending/approved state.

Likely follow-up features:

- Payment proof upload.
- Bulk approve.
- Teacher invoice/message template.
- Payment gateway integration after workflow validation.

