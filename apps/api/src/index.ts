import { Hono } from "hono";
import { cors } from "hono/cors";
import { getDb } from "./db/client";
import { tenants } from "./db/schema";
import { errorHandler } from "./middleware/error-handler";
import { adminRoutes } from "./routes/admin";
import { authRoutes } from "./routes/auth";
import { courseAccessRoutes, coursesRoutes } from "./routes/courses";
import { examTopicsRoutes } from "./routes/exam-topics";

const app = new Hono<{ Bindings: Env }>()
  .onError(errorHandler)
  // Frontend and API are cross-origin by default (ADR-0063/ADR-0064: separate
  // `*.vercel.app` / `*.workers.dev` domains). No credentialed cookies, so no
  // `Access-Control-Allow-Credentials` is needed — the bearer token is
  // attached explicitly by application code, not sent as an ambient cookie.
  .use(
    "*",
    cors({
      origin: (origin, c) =>
        c.env.FRONTEND_ORIGIN.split(",")
          .map((allowed: string) => allowed.trim())
          .includes(origin)
          ? origin
          : undefined,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    }),
  )
  .get("/health", async (c) => {
    const db = getDb(c.env.DB);
    // Trivial real query, not just a ping — confirms the D1 binding and the
    // Drizzle schema actually agree with each other, not just that the Worker boots.
    const sample = await db.select().from(tenants).limit(1);
    return c.json({ status: "ok", tenantSample: sample });
  })
  .route("/auth", authRoutes)
  .route("/admin", adminRoutes)
  .route("/exam-topics", examTopicsRoutes)
  .route("/", courseAccessRoutes)
  .route("/", coursesRoutes);

export type AppType = typeof app;

export default app;
