import { Hono } from "hono";
import { authRoutes } from "./auth/auth.routes";
import { courseAccessRoutes, coursesRoutes } from "./courses/courses.routes";
import { examTopicsRoutes } from "./exam-topics/exam-topics.routes";
import { healthRoutes } from "./health/health.routes";
import { tenantRoutes } from "./tenants/tenants.routes";
import type { Env } from "../types/env";

export const featureRoutes = new Hono<{ Bindings: Env }>()
  .route("/", healthRoutes)
  .route("/auth", authRoutes)
  .route("/admin", tenantRoutes)
  .route("/exam-topics", examTopicsRoutes)
  .route("/", courseAccessRoutes)
  .route("/", coursesRoutes);
