// ADR-0054/ADR-0064: JWT claims are a UI convenience only. Every real
// authorization check re-loads the user from the DB — a revoked/deactivated
// account or a stale role in an old token must never grant access just
// because the bearer token still verifies.
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { getDb } from "../db/client";
import { users } from "../db/schema";
import { verifySession } from "../utils/jwt";
import { toPublicUser, type PublicUser } from "../utils/user";
import type { Role } from "../types";

export type AuthEnv = {
  Bindings: Env;
  Variables: {
    user: PublicUser;
  };
};

const BEARER_PREFIX = "Bearer ";

async function authenticate(c: Context<AuthEnv>): Promise<PublicUser> {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith(BEARER_PREFIX) ? authHeader.slice(BEARER_PREFIX.length) : undefined;
  if (!token) throw new HTTPException(401, { message: "Not authenticated" });

  const session = await verifySession(token, c.env.JWT_SECRET);
  if (!session) throw new HTTPException(401, { message: "Not authenticated" });

  const db = getDb(c.env.DB);
  const [row] = await db.select().from(users).where(eq(users.id, session.sub)).limit(1);
  if (!row || row.status !== "active") {
    throw new HTTPException(401, { message: "Not authenticated" });
  }

  return toPublicUser(row);
}

/** Requires an authenticated, active user. If `roles` is given, also requires
 * the user's role to be one of them. */
export function requireRole(...roles: Role[]) {
  return createMiddleware<AuthEnv>(async (c, next) => {
    const user = await authenticate(c);
    if (roles.length > 0 && !roles.includes(user.role)) {
      throw new HTTPException(403, { message: "Forbidden" });
    }
    c.set("user", user);
    await next();
  });
}

/** Requires any authenticated, active user, with no role restriction. */
export const requireAuth = requireRole();
