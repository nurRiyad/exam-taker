# Quality

- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` before handing off implementation changes when the environment supports them.
- Keep shared request validation in `packages/validation` so mocked UI flows and API handlers can use the same rules.
- Keep mock data deterministic and representative of loading, empty, success, and error states.
- Prefer focused tests for shared validation and server-side behavior.
