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
  const files = readdirSync(dir).filter((name) => name.endsWith(".sqlite") && name !== "metadata.sqlite");
  if (files.length > 1) {
    // Multiple candidates usually means stale `wrangler dev` processes left
    // behind old D1 state (each gets its own hash-named file). Picking one
    // arbitrarily makes Studio silently diverge from whatever the live dev
    // server is actually reading/writing, so fail loud instead: kill orphaned
    // `wrangler dev`/`workerd` processes and delete the stale file(s).
    throw new Error(
      `Found ${files.length} local D1 sqlite files in ${dir}, expected 1: ${files.join(", ")}. ` +
        "This usually means an old `wrangler dev` process is still running. " +
        "Kill orphaned wrangler/workerd processes and delete the stale file before running db:studio.",
    );
  }
  return files[0] ? join(dir, files[0]) : "";
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: { url: findLocalD1File() },
});
