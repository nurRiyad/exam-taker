import { cors } from "hono/cors";

type CorsOptions = NonNullable<Parameters<typeof cors>[0]>;

const resolveAllowedOrigin: NonNullable<CorsOptions["origin"]> = (origin, c) => {
  const allowedOrigins = c.env.FRONTEND_ORIGIN.split(",").map((allowed: string) => allowed.trim());
  return allowedOrigins.includes(origin) ? origin : undefined;
};

// Frontend and API are cross-origin by default (ADR-0063/ADR-0064: separate
// `*.vercel.app` / `*.workers.dev` domains). No credentialed cookies, so no
// `Access-Control-Allow-Credentials` is needed — the bearer token is attached
// explicitly by application code, not sent as an ambient cookie.
export const corsMiddleware = cors({
  origin: resolveAllowedOrigin,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
} satisfies CorsOptions);