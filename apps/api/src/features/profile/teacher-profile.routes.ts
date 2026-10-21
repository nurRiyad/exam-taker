import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { teacherPublicProfileSchema } from "@exam-taker/validation";
import { requireAuth, type AuthEnv } from "../../middleware/auth";
import * as profileService from "./teacher-profile.service";

export const teacherProfileRoutes = new Hono<AuthEnv>()
  .get("/", requireAuth, (c) => {
    const user = c.get("user");
    if (user.role !== "teacher") return c.json({ error: "শুধু শিক্ষক এই প্রোফাইল দেখতে পারবেন" }, 403);
    return c.json({ profile: profileService.getTeacherPublicProfile(user) });
  })
  .put("/", requireAuth, zValidator("json", teacherPublicProfileSchema), (c) => {
    if (c.get("user").role !== "teacher") return c.json({ error: "শুধু শিক্ষক এই প্রোফাইল সম্পাদনা করতে পারবেন" }, 403);
    return c.json({ profile: profileService.updateTeacherPublicProfile(c.req.valid("json")) });
  });
