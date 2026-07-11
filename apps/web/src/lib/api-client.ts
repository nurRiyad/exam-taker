import { hc } from "hono/client";
import type { AppType } from "api/src/index";
import { getSessionToken } from "./session-token";

// Frontend and API are cross-origin by default (ADR-0063/ADR-0064: separate
// `*.vercel.app` / `*.workers.dev` domains) — falls back to the same-origin
// "/api" path in local dev, which next.config.ts rewrites to the API Worker.
// Every request explicitly attaches Authorization: Bearer <token>, read fresh
// at call time (not baked in at client-construction time) since this is a
// long-lived singleton shared across the app.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const apiClient = hc<AppType>(API_BASE_URL, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    const token = getSessionToken();
    const headers = new Headers(init?.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  },
});
