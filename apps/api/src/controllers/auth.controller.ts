// HTTP-facing orchestration — the only layer aware of both Hono `Context` and
// the service layer. Owns status codes, response shaping, and session cookie
// issuance (cookies need `c`, so that can't live in the Hono-agnostic service).
import type { Context } from "hono";
import { getDb } from "../db/client";
import { clearSessionCookie, setSessionCookie, signSession } from "../utils/jwt";
import type { AuthEnv } from "../middleware/auth";
import * as authService from "../services/auth.service";
import type { GenerateResetCodeInput, LoginInput, RedeemResetCodeInput, SignupInput } from "../validation/auth";

export async function checkUsernameAvailability(c: Context<AuthEnv>, username: string) {
  const db = getDb(c.env.DB);
  const available = await authService.checkUsernameAvailability(db, username);
  return c.json({ available });
}

export async function signup(c: Context<AuthEnv>, input: SignupInput) {
  const db = getDb(c.env.DB);
  const user = await authService.signup(db, input);
  const token = await signSession({ sub: user.id, role: user.role }, c.env.JWT_SECRET);
  setSessionCookie(c, token);
  return c.json({ user }, 201);
}

export async function login(c: Context<AuthEnv>, input: LoginInput) {
  const db = getDb(c.env.DB);
  const user = await authService.login(db, input);
  const token = await signSession({ sub: user.id, role: user.role }, c.env.JWT_SECRET);
  setSessionCookie(c, token);
  return c.json({ user });
}

export function logout(c: Context<AuthEnv>) {
  // No requireAuth: logout must succeed idempotently even for an expired
  // session or a deactivated/blocked account — it only clears the
  // requester's own cookie, nothing that needs authorization.
  clearSessionCookie(c);
  return c.body(null, 204);
}

export function me(c: Context<AuthEnv>) {
  return c.json({ user: c.get("user") });
}

export async function generateResetCode(c: Context<AuthEnv>, input: GenerateResetCodeInput) {
  const db = getDb(c.env.DB);
  const result = await authService.generateResetCode(db, input, c.get("user").id);
  return c.json(result, 201);
}

export async function redeemResetCode(c: Context<AuthEnv>, input: RedeemResetCodeInput) {
  const db = getDb(c.env.DB);
  await authService.redeemResetCode(db, input);
  return c.json({ ok: true });
}
