# Exam Taker Agent Instructions

The UI-first phase is complete enough to begin API integration. For each requested page or flow, implement its Hono API endpoint and connect the UI to it. During this demo phase, endpoints return realistic hard-coded data from feature-local API service modules; do not add production business rules, database persistence, Drizzle schema, or migrations unless the user explicitly asks for them. Keep the current application code and migrate it incrementally into the structure below.

## Structure

- `apps/web`: Next.js UI and product modules.
- `apps/api`: Hono Worker API; implement a route and service for each requested page or flow, returning hard-coded demo data until production business logic and persistence are separately authorized.
- `packages/db`: Drizzle schema, database client, and D1 migrations.
- `packages/validation`: shared Zod schemas and inferred types for UI and API.
- `docs`: concise product, development, architecture, quality, and deployment guidance.

## Workflow

1. For each requested page or flow, add or extend a Hono route and feature-local service that supplies hard-coded demo data, then connect the UI to that API. Include loading, empty, error, and success states where they apply. Keep database and production business logic out of scope unless explicitly requested.
2. Use TanStack Query for browser-side server state. Put typed endpoint request functions in `apps/web/src/features/<feature>/api.ts` and query keys/options/hooks in `queries.ts` alongside them. Call hooks from client UI. Use queries for reads and mutations for writes; invalidate or update related queries after successful mutations. Keep API calls out of page/component event handlers.
3. Keep the shared typed Hono client and cross-cutting API utilities in `apps/web/src/utils/`. Server Components, Next proxy code, and other server-only callers use feature request functions directly (with explicit token/cookie and cache handling); TanStack hooks are client-only.
4. Keep UI-only state near the relevant product feature and implement every visible action. Preserve working routes and functionality while restructuring; avoid speculative feature changes.
5. Use [docs/UI-ROUTES.md](docs/UI-ROUTES.md) as the route, UI behavior, and page-visibility map. Check it before changing a product flow and update it when routes, audiences, or user-visible behavior materially change. It records current implementation status separately from intended MVP behavior.
6. Preserve the visibility model in that guide: admins have platform-wide views; teachers are limited to their own courses and enrolled students; students are limited to their own memberships and results; public pages use teacher-branded storefronts and explicitly published content. Navigation visibility does not replace authorization checks.

## UI Product Principles

- **Bangla first:** User-facing copy, labels, navigation, validation messages, empty states, and mock content should be Bangla by default. Keep text and locale-sensitive formatting easy to adapt for English later; do not add an English-language UI unless requested.
- **Mobile first:** Design and implement the narrow-screen experience first, then enhance for larger breakpoints. Check that core tasks work with touch, readable type, sensible spacing, and no horizontal overflow on small screens.
- **Minimal and space-efficient:** Prioritize the user's task and useful content. Keep copy concise, avoid decorative or repetitive messages, and use available screen space well without making layouts feel crowded. Show feedback when it helps users understand the result of an action.
- **Small reusable components:** Prefer focused components with clear responsibilities. Reuse shared components and feature-local patterns where doing so improves consistency; avoid premature abstraction and oversized all-in-one components.
- **shadcn/ui first:** Before creating a UI primitive, check whether the project already has a suitable shadcn/ui component. Reuse or compose it and follow the installed shadcn conventions. Add a shadcn component when it fits the need; customize styling to the product rather than rebuilding an equivalent primitive from scratch.
- **Forms:** Use React Hook Form for interactive forms and Zod schemas for validation. Show concise Bangla field-level errors, associate labels and descriptions correctly, preserve entered values when appropriate, and provide clear pending, success, and failure feedback. Keep validation rules reusable where practical.
- **Motion:** Make route and UI-state changes feel smooth with restrained transitions/animations. Respect `prefers-reduced-motion`; motion must not delay actions, obscure content, or make forms and navigation harder to use.
- **Accessibility:** Use semantic HTML, accessible names, keyboard-operable controls, visible focus states, sufficient contrast, and correct dialog/menu behavior. Do not rely on color alone to communicate status.
- **Responsive states:** Design loading, empty, error, success, and disabled states along with the primary state. Ensure realistic mock interactions can reach these states and that each user action has a clear, concise response.
- **Consistency:** Reuse spacing, typography, colors, radii, and interaction patterns from the existing design system. Prefer existing project conventions and components over introducing a new library or one-off visual pattern.

## Tooling

- Use Node `24.14.1` from `.nvmrc` and pnpm only.
- Use root workspace commands where available: `pnpm dev`, `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- Keep one Git repository at the project root.
- Keep local D1 data and secrets out of version control.

## Git Commits

- Before creating a commit, follow [.github/copilot-instructions.md](.github/copilot-instructions.md).
- Use a conventional commit subject in the format `<type>: <imperative one-line title>`.
- Review staged, unstaged, and untracked changes before committing. Include only changes relevant to the requested commit; separate unrelated work into separate commits or leave it uncommitted.
- Run the checks requested by the user before committing, and report their results.

## Project Skills

- Use `.agents/skills/vercel-react-best-practices/SKILL.md` for React/Next.js implementation, refactoring, or performance review. Read the linked rule files as needed.
- Use `.agents/skills/web-design-guidelines/SKILL.md` when auditing UI accessibility, usability, or interface quality; it retrieves the current review checklist before each audit.
- Use `.agents/skills/shadcn/SKILL.md` when adding, searching, fixing, debugging, styling, or composing shadcn/ui components.
