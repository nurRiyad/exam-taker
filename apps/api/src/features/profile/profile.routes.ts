import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { profileSchema } from "@exam-taker/validation";
import { requireAuth, type AuthEnv } from "../../middleware/auth";
import * as profileService from "./profile.service";

export const profileRoutes = new Hono<AuthEnv>()
  .get("/", requireAuth, (c) => c.json({ profile: profileService.getProfile(c.get("user")) }))
  .put("/", requireAuth, zValidator("json", profileSchema), (c) =>
    c.json({ profile: profileService.updateProfile(c.req.valid("json")) }),
  );
