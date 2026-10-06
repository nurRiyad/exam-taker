import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const localD1Directory = resolve("../../apps/api/.wrangler/state/v3/d1/miniflare-D1DatabaseObject");
const timeoutAt = Date.now() + 60_000;
const apiHealthUrl = process.env.API_DEV_ORIGIN ?? "http://localhost:8787";

function localD1Files() {
  if (!existsSync(localD1Directory)) return [];
  return readdirSync(localD1Directory).filter((file) => file.endsWith(".sqlite") && file !== "metadata.sqlite");
}

while (localD1Files().length === 0 && Date.now() < timeoutAt) {
  // Miniflare creates the local D1 file lazily on the first request that
  // touches the DB binding. The health route runs a lightweight DB query.
  try {
    await fetch(`${apiHealthUrl}/health`);
  } catch {
    // Wrangler may still be booting; retry until its dev server is reachable.
  }

  if (localD1Files().length > 0) break;
  await new Promise((resolveWait) => setTimeout(resolveWait, 500));
}

if (localD1Files().length === 0) {
  console.error(`Local D1 did not start. Check that the API dev server is reachable at ${apiHealthUrl}.`);
  process.exit(1);
}

const studio = spawn(
  process.execPath,
  [
    resolve("node_modules/drizzle-kit/bin.cjs"),
    "studio",
    "--config",
    "drizzle.config.ts",
    "--port",
    "4983",
    "--host",
    "127.0.0.1",
  ],
  { stdio: "inherit" },
);

studio.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
