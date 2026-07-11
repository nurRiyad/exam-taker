import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/error-handler";
import { routes } from "./routes";

const app = new Hono<{ Bindings: Env }>()
  .onError(errorHandler)
  .use("*", corsMiddleware)
  .route("/", routes);

export type AppType = typeof app;

export default app;
