import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/error-handler";
import { featureRoutes } from "./features";
import type { Env } from "./types/env";

const app = new Hono<{ Bindings: Env }>().onError(errorHandler).use("*", corsMiddleware).route("/", featureRoutes);

export type AppType = typeof app;

export default app;
