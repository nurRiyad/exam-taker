// apps/api's `AppType` (imported type-only in src/lib/api-client.ts, per
// ADR-0059) references a couple of Cloudflare Workers ambient globals
// (`Env`, `D1Database`) declared in apps/api/worker-configuration.d.ts.
// That file also redefines the global `Response`/`fetch` to their
// Workers-flavored shapes — including it here would leak those overrides
// into the whole Next.js app and conflict with Hono's browser-flavored RPC
// client types. These loose shims resolve the names without pulling in the
// rest of that file; the actual bindings never matter on the frontend.
declare global {
  interface Env {
    CACHE: unknown;
    DB: D1Database;
    JWT_SECRET: string;
  }
  type D1Database = unknown;
}

export {};
