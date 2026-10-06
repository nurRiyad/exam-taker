# API Agent Instructions

- Keep API features in `apps/api/src/features/<feature>` with feature-local routes, services, and repositories.
- Routes validate and shape HTTP input/output directly; services hold business rules and repositories handle persistence. Do not add a controller layer.
- Keep cross-cutting request middleware in `middleware/`, pure helpers in `utils/`, and shared database/validation code in workspace packages.
- Use `@exam-taker/db` for Drizzle access and `@exam-taker/validation` for shared schemas and types.
- Keep API response typing compatible with Hono RPC consumed by `apps/web`.
- Use pnpm and the root commands in `docs/DEVELOPMENT.md`.
