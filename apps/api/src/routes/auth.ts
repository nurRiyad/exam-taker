import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import * as authController from "../controllers/auth.controller";
import { requireAuth, requireRole, type AuthEnv } from "../middleware/auth";
import {
  generateResetCodeSchema,
  loginSchema,
  redeemResetCodeSchema,
  signupSchema,
  usernameSchema,
} from "../validation/auth";

// Handlers stay inline one-liners delegating to the controller — required for
// Hono RPC type inference (`hc<AppType>()` in apps/web); see the `hono` skill.
export const authRoutes = new Hono<AuthEnv>()
  .get("/username-availability", zValidator("query", z.object({ username: usernameSchema })), (c) =>
    authController.checkUsernameAvailability(c, c.req.valid("query").username),
  )
  .post("/signup", zValidator("json", signupSchema), (c) => authController.signup(c, c.req.valid("json")))
  .post("/login", zValidator("json", loginSchema), (c) => authController.login(c, c.req.valid("json")))
  .post("/logout", (c) => authController.logout(c))
  .get("/me", requireAuth, (c) => authController.me(c))
  .post("/reset-codes", requireRole("teacher", "admin"), zValidator("json", generateResetCodeSchema), (c) =>
    authController.generateResetCode(c, c.req.valid("json")),
  )
  .post("/reset", zValidator("json", redeemResetCodeSchema), (c) =>
    authController.redeemResetCode(c, c.req.valid("json")),
  );
