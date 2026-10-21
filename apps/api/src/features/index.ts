import { Hono } from "hono";
import { authRoutes } from "./auth/auth.routes";
import { courseAccessRoutes, coursesRoutes } from "./courses/courses.routes";
import { healthRoutes } from "./health/health.routes";
import { homeRoutes } from "./home/home.routes";
import { profileRoutes } from "./profile/profile.routes";
import { teacherProfileRoutes } from "./profile/teacher-profile.routes";
import { tenantRoutes } from "./tenants/tenants.routes";
import type { Env } from "../types/env";

export const featureRoutes = new Hono<{ Bindings: Env }>()
  .route("/", healthRoutes)
  .route("/home", homeRoutes)
  .route("/auth", authRoutes)
  .route("/profile", profileRoutes)
  .route("/teacher-profile", teacherProfileRoutes)
  .route("/admin", tenantRoutes)
  .route("/", courseAccessRoutes)
  .route("/", coursesRoutes);
