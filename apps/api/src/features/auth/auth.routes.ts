import { zValidator } from "@hono/zod-validator";
import { getDb } from "@exam-taker/db";
import { Hono } from "hono";
import { z } from "zod";
import { requireAuth, requireRole, type AuthEnv } from "../../middleware/auth";
import { signSession } from "../../utils/jwt";
import {
  generateResetCodeSchema,
  loginSchema,
  redeemResetCodeSchema,
  signupSchema,
  usernameSchema,
} from "@exam-taker/validation/auth";
import * as authService from "./auth.service";

export const authRoutes = new Hono<AuthEnv>()
  .get("/username-availability", zValidator("query", z.object({ username: usernameSchema })), async (c) => {
    const available = await authService.checkUsernameAvailability(getDb(c.env.DB), c.req.valid("query").username);
    return c.json({ available });
  })
  .post("/signup", zValidator("json", signupSchema), async (c) => {
    const user = await authService.signup(getDb(c.env.DB), c.req.valid("json"));
    const token = await signSession({ sub: user.id, role: user.role }, requireJwtSecret(c.env.JWT_SECRET));
    return c.json({ user, token }, 201);
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const user = await authService.login(getDb(c.env.DB), c.req.valid("json"));
    const token = await signSession({ sub: user.id, role: user.role }, requireJwtSecret(c.env.JWT_SECRET));
    return c.json({ user, token });
  })
  .post("/logout", (c) => c.body(null, 204))
  .get("/me", requireAuth, (c) => c.json({ user: c.get("user") }))
  .post("/reset-codes", requireRole("teacher", "admin"), zValidator("json", generateResetCodeSchema), async (c) => {
    const result = await authService.generateResetCode(getDb(c.env.DB), c.req.valid("json"), c.get("user"));
    return c.json(result, 201);
  })
  .post("/reset", zValidator("json", redeemResetCodeSchema), async (c) => {
    await authService.redeemResetCode(getDb(c.env.DB), c.req.valid("json"));
    return c.json({ ok: true });
  });

function requireJwtSecret(secret: string | undefined): string {
  if (!secret) {
    throw new Error("JWT_SECRET is not configured. Set it in apps/api/.dev.vars for local development.");
  }
  return secret;
}
