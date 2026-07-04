// Server Components run outside the browser, so `fetch` needs an absolute
// URL and isn't subject to the same-origin cookie concerns ADR-0060 exists
// for (that's about browser requests). Server-side code talks to the API's
// real origin directly instead of round-tripping through the /api/* rewrite
// in next.config.ts, which is for client-side fetches only.
const API_ORIGIN = process.env.API_INTERNAL_URL ?? "http://localhost:8787";

async function getHealth() {
  try {
    const res = await fetch(`${API_ORIGIN}/health`, { cache: "no-store" });
    if (!res.ok) return { ok: false as const, error: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: true as const, data };
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "unknown error" };
  }
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main className="flex min-h-dvh flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Exam Taker — local dev</h1>
      <p className="text-sm text-zinc-500">
        This page is a Step 2 scaffold placeholder, not product UI. It exists to prove the
        Next.js dev server can reach the Hono API through the same-origin proxy.
      </p>
      <div className="rounded-lg border p-4 text-sm">
        <p className="font-medium">API health check (/api/health):</p>
        <pre className="mt-2 overflow-x-auto rounded bg-zinc-100 p-3 text-xs dark:bg-zinc-900">
          {JSON.stringify(health, null, 2)}
        </pre>
      </div>
    </main>
  );
}
