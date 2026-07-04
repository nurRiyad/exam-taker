# ADR 0057: Generate Print/PDF Output Without A Headless Browser

## Status

Accepted

## Context

ADR-0012 and ADR-0027 require teacher-facing print/export of exam questions with polished Bangla layout and a teacher/platform watermark, available from day one. The obvious implementation (render an HTML page, print it to PDF with a headless Chrome/Puppeteer-style service) is not free on Cloudflare: Browser Rendering is a paid add-on and risks breaking the 2,000 BDT/month early budget guardrail (ADR-0051) well before the pilot proves revenue.

## Decision

Generate PDFs directly with a pure-JS/WASM-free PDF library (`pdf-lib` or equivalent that runs inside a Cloudflare Worker) rather than headless-browser HTML-to-PDF rendering. Embed a Bangla-capable font (for example Noto Sans Bengali) into the PDF for subsetting, and hand-build the question-paper and answer-key layout templates (pagination, question numbering, option layout, watermark/header) directly against the library's drawing API instead of via HTML/CSS.

## Consequences

Benefits:

- Stays inside Workers CPU/cost limits with no paid rendering add-on, protecting the early budget guardrail.
- No external rendering dependency to keep available/patched.

Tradeoffs:

- Building and maintaining print layout (pagination, Bangla text shaping, watermark placement) directly against a drawing API is more implementation effort than writing HTML/CSS and letting a browser lay it out.
- Complex layout changes (for example, future image-based questions, ADR-0034) will cost more engineering time under this approach than under HTML-to-PDF.

## Follow-up

- Verify Bangla glyph shaping/rendering quality with the chosen library and font early, since ADR-0027 requires this to be polished from day one, not iterated on after teachers complain.
- Revisit headless-browser rendering only if/when pilot revenue comfortably covers the Browser Rendering add-on cost and layout complexity outgrows hand-built templates.
