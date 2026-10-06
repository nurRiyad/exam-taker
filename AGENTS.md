# Exam Taker Agent Instructions

This repository is being rebuilt with a UI-first workflow. Until the user explicitly says the frontend is ready for backend work, work only on the UI in `apps/web`. Keep the current application code and migrate it incrementally into the structure below.

## Structure

- `apps/web`: Next.js UI and product modules.
- `apps/api`: Hono Worker API; do not build or expand backend behavior until the user explicitly says the frontend is ready for backend work.
- `packages/db`: Drizzle schema, database client, and D1 migrations.
- `packages/validation`: shared Zod schemas and inferred types for UI and API.
- `docs`: concise product, development, architecture, quality, and deployment guidance.

## Workflow

1. Build complete, polished, responsive UI flows in `apps/web` using realistic local/mock data. Implement every visible user action and its UI state, including list filtering/sorting, empty/loading/error/success states, dialogs, and form submission feedback where relevant.
2. Keep mock data and UI state near the relevant product feature. Avoid new API calls, backend changes, database changes, or backend-driven product behavior until the user explicitly gives the go-ahead to begin backend work.
3. Treat UI readiness as a user decision. Do not switch to backend work just because a screen or feature appears complete; continue implementing the requested frontend scope with mock data until the user says the frontend is ready.
4. Preserve working routes and functionality while restructuring; avoid speculative feature changes.

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
