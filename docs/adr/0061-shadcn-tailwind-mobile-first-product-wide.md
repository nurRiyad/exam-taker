# ADR 0061: shadcn/ui + Tailwind, Mobile-first As A Product-wide Default

## Status

Accepted. Broadens the scope of [ADR-0002](0002-mobile-first-exam-experience.md).

## Context

ADR-0002 required a mobile-first *exam-taking* experience specifically. The founder has since stated that roughly 99% of all users — not just students mid-exam — are on mobile, including teachers managing courses and questions. The frontend component/styling approach had not yet been chosen.

## Decision

- Use Tailwind CSS with shadcn/ui as the component library for `apps/web`, across both public/student pages and the teacher/admin panel.
- Mobile-first is the default design posture for the entire product, not only the exam-attempt page: author styles for the smallest supported viewport first (assume roughly 360–390px width) and add `sm:`/`md:`/`lg:` overrides for larger screens, following Tailwind's native mobile-first breakpoint model — never the reverse.
- Every interactive control (buttons, tap targets, form inputs) must be usable with touch as the primary input; do not rely on hover-only affordances anywhere in the product, including the teacher/admin panel.
- Admin/teacher-heavy screens (for example, bulk CSV import review, question authoring) may progressively enhance for wider viewports, but must remain functionally usable at mobile width, not degrade to "desktop only."

## Consequences

Benefits:

- shadcn/ui ships unstyled, accessible Radix-based primitives copied into the repo rather than pulled in as an opaque npm dependency, so touch-target sizing and mobile behavior can be adjusted directly.
- One consistent design system and mobile-first discipline across teacher and student surfaces, avoiding the trap of building the "real" UI for desktop and retrofitting mobile later.
- Tailwind's utility model makes the mobile-first default hard to get backwards accidentally, since unprefixed utilities are already the base/smallest-screen styles.

Tradeoffs:

- Naturally dense/tabular teacher workflows (for example, reviewing 300 students' payment status) take more design effort to make genuinely usable on a phone, rather than shipping a desktop-only table.
- shadcn/ui components are copied into the repo, not centrally upgraded — updates are a manual pull, not a version bump.

## Follow-up

When Step 2 of `docs/build-plan.md` scaffolds `apps/web`, run the shadcn init against the mobile-first breakpoint plan; do not accept desktop-first defaults from shadcn's docs/examples without adjusting them.
