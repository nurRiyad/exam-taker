<!-- BEGIN:nextjs-agent-rules -->
# Web Agent Instructions

## Next.js Version Warning

This project uses Next.js `16.2.10`.

Do not assume older Next.js behavior. Before implementing framework-level changes, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## Frontend Conventions

- Mobile-first is mandatory across all surfaces (teacher/admin included).
- Keep route protection in `src/proxy.ts` (this replaces older `middleware.ts` conventions).
- Use App Router patterns under `src/app` and preserve existing route-group structure.
- Use the shared API client in `src/lib/api-client.ts` (Hono RPC types from backend), not ad-hoc fetch wrappers.
- Use `src/lib/session-token.ts` helpers for token persistence/reads.

## Commands

- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web lint`
- `pnpm --filter web typecheck`

## Related Docs

- Project-wide rules: [../../AGENTS.md](../../AGENTS.md)
- Canonical architecture and decisions: [../../CLAUDE.md](../../CLAUDE.md)
- Full implementation details: [../../docs/technical-design.md](../../docs/technical-design.md)
<!-- END:nextjs-agent-rules -->
