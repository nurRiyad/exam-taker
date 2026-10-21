// JWT session handling: HS256, 30-day flat expiry, no
// refresh flow. Sent as an Authorization: Bearer header, not a cookie — the
// frontend and API live on different registrable domains. JWT claims are a
// UI convenience only — every real authorization check must still hit the DB
// (see src/middleware/auth.ts), never trust these claims alone.
import { sign, verify } from "hono/jwt";
import type { Role } from "../types";

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export type SessionPayload = {
  sub: string;
  role: Role;
  tenantId?: string;
};

function isSessionPayload(payload: unknown): payload is SessionPayload {
  if (typeof payload !== "object" || payload === null) return false;
  const { sub, role, tenantId } = payload as Record<string, unknown>;
  return (
    typeof sub === "string" &&
    (role === "student" || role === "teacher" || role === "admin") &&
    (tenantId === undefined || typeof tenantId === "string") &&
    (role !== "student" || typeof tenantId === "string")
  );
}

export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  return sign({ ...payload, exp }, secret, "HS256");
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const payload = await verify(token, secret, "HS256");
    if (!isSessionPayload(payload)) return null;
    const claims = payload as SessionPayload;
    return { sub: claims.sub, role: claims.role, ...(claims.tenantId ? { tenantId: claims.tenantId } : {}) };
  } catch {
    // Covers expired/malformed/signature-mismatched tokens alike — the caller
    // only needs to know "not a valid session", not why.
    return null;
  }
}
