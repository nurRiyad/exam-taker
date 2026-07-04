/// <reference types="node" />
// This file runs under Node (via the drizzle-kit CLI), never inside the
// Workers runtime, so it's fine to use Node builtins here even though the
// rest of `apps/api` targets Workers-only types (tsconfig's `types` array
// deliberately excludes `@types/node` globals for everything else).
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "drizzle-kit";

// `db:studio` (drizzle-kit studio) needs a real sqlite file to open — that's
// wrangler's local D1 simulation, which lives under a hash-named file that
// changes if `.wrangler/state` is ever wiped. Resolved here instead of
// hardcoded so `db:studio` keeps working without manual upkeep. Not needed by
// `db:generate` (schema.ts -> next numbered SQL migration), which only diffs
// `schema.ts` and never touches this file.
function findLocalD1File(): string {
  const dir = join(".wrangler", "state", "v3", "d1", "miniflare-D1DatabaseObject");
  if (!existsSync(dir)) return "";
  const file = readdirSync(dir).find((name) => name.endsWith(".sqlite") && name !== "metadata.sqlite");
  return file ? join(dir, file) : "";
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: { url: findLocalD1File() },
});
