import { hc } from "hono/client";
import type { AppType } from "@exam-taker/api/src/index";
import { getSessionToken } from "./session-token";
import type { Role } from "@exam-taker/api/src/types";

// Frontend and API are cross-origin in both local development and production.
// Every request explicitly attaches Authorization: Bearer <token>, read fresh
// at call time (not baked in at client-construction time) since this is a
// long-lived singleton shared across the app.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export const apiClient = hc<AppType>(API_BASE_URL, {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    const token = getSessionToken();
    const headers = new Headers(init?.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  },
});

export async function unwrapApiResponse<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    const { extractApiError } = await import("@/utils/api-error");
    const { message } = await extractApiError(response, fallback);
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function getCurrentUserFromServer(token?: string) {
  const response = await fetch(`${process.env.API_INTERNAL_URL ?? "http://localhost:8787"}/auth/me`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) return undefined;
  return (await response.json()) as { user: { id: string; name: string | null; username: string; role: Role } };
}

export async function getHomeFromServer<T>() {
  const response = await fetch(`${process.env.API_INTERNAL_URL ?? "http://localhost:8787"}/home`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Home API request failed");
  return (await response.json()) as T;
}
