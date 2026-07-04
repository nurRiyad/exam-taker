# ADR 0034: Do Not Support Question Images In Initial Release

## Status

Accepted

## Context

Question images can mean two different things:

- Uploading a photo/image and extracting questions from it.
- Adding an image, chart, or diagram inside an MCQ.

Both add storage, rendering, import, print, and mobile layout complexity.

## Decision

Initial release does not support image-to-question extraction or image-based MCQs.

## Consequences

Benefits:

- Keeps MVP focused on text-based MCQs.
- Simplifies import template.
- Simplifies Bangla PDF/print rendering.

Tradeoffs:

- Some exams that need diagrams/charts may not fit yet.

Future:

- Add image-based MCQs after text exam workflow is validated.

