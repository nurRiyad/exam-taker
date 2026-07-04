// JWT session handling (ADR-0054): HS256, 30-day flat expiry, no refresh flow.
// JWT claims are a UI convenience only — every real authorization check must
// still hit the DB (see src/middleware/auth.ts), never trust these claims alone.
import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { Role } from "../types";

export const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days, per ADR-0054

export type SessionPayload = {
  sub: string;
  role: Role;
};

function isSessionPayload(payload: unknown): payload is SessionPayload {
  if (typeof payload !== "object" || payload === null) return false;
  const { sub, role } = payload as Record<string, unknown>;
  return typeof sub === "string" && (role === "student" || role === "teacher" || role === "admin");
}

export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  return sign({ ...payload, exp }, secret, "HS256");
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const payload = await verify(token, secret, "HS256");
    return isSessionPayload(payload) ? { sub: payload.sub, role: payload.role } : null;
  } catch {
    // Covers expired/malformed/signature-mismatched tokens alike — the caller
    // only needs to know "not a valid session", not why.
    return null;
  }
}

// No `Domain` attribute yet: no real domain exists until the Step 2 deferred
// domain/hosting setup lands. Add `Domain=.<domain>` then, per ADR-0060.
export function setSessionCookie(c: Context, token: string): void {
  setCookie(c, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === "https:",
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(c: Context): void {
  deleteCookie(c, SESSION_COOKIE_NAME, { path: "/" });
}
