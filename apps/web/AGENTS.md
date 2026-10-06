# Web Agent Instructions

- Until the user explicitly says the frontend is ready for backend work, work only on UI in `apps/web`. Do not add or expand API calls, backend behavior, or database integration; use realistic feature-local mock data.
- Complete the requested frontend flows and user interactions with mock data, including relevant loading, empty, error, success, and disabled states. The user decides when the frontend is ready for backend work.
- Preserve existing routes and working interactions while restructuring.
- Make Bangla the default for all user-facing copy and mock content; keep the UI straightforward to localize to English later.
- Design mobile-first, then adapt for wider screens. Ensure touch-friendly controls, readable content, and no horizontal overflow at narrow widths.
- Keep the interface minimal and space-efficient, with concise copy and clear feedback for user actions.
- Prefer small, focused, reusable components. Check for and reuse suitable installed shadcn/ui components before creating primitives; follow this project's shadcn conventions.
- Use React Hook Form with Zod validation for interactive forms. Provide accessible labels and concise Bangla field errors, and handle pending, success, and failure states.
- Use restrained transitions for navigation and UI-state changes, while respecting `prefers-reduced-motion` and keeping interactions immediate.
- Follow accessibility basics: semantic elements, keyboard support, visible focus, sufficient contrast, and accessible dialogs/menus.
- Follow the existing Next.js App Router conventions and existing design tokens/components.
- Use pnpm and the root commands in `docs/DEVELOPMENT.md`.
