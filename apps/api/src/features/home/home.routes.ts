import { Hono } from "hono";
import type { Env } from "../../types/env";
import { homePageContent } from "./home.data";

export const homeRoutes = new Hono<{ Bindings: Env }>().get("/", (c) => c.json(homePageContent));
