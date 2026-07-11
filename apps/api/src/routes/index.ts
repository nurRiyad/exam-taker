import { Hono } from "hono";
import { adminRoutes } from "./admin";
import { authRoutes } from "./auth";
import { courseAccessRoutes, coursesRoutes } from "./courses";
import { examTopicsRoutes } from "./exam-topics";
import { healthRoutes } from "./health";

export const routes = new Hono<{ Bindings: Env }>()
  .route("/", healthRoutes)
  .route("/auth", authRoutes)
  .route("/admin", adminRoutes)
  .route("/exam-topics", examTopicsRoutes)
  .route("/", courseAccessRoutes)
  .route("/", coursesRoutes);
