import { hc } from "hono/client";
import type { AppType } from "api/src/index";

// Same-origin "/api" — next.config.ts rewrites this to the API Worker in dev,
// and production routes apex/api.<domain> through the shared cookie domain
// (ADR-0060). Only for browser-originated calls; server components/proxy
// talk to API_INTERNAL_URL directly (see apps/web/src/proxy.ts).
export const apiClient = hc<AppType>("/api");
