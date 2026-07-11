import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "api/src/types";
import { SESSION_TOKEN_COOKIE } from "@/lib/session-token";

// Server components/proxy talk to the API's real origin directly, bypassing
// next.config.ts's /api/* rewrite (that rewrite is for browser requests only,
// see docs/technical-design.md's Local Development section).
const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8787";

// ADR-0054/ADR-0064: JWT claims are a UI convenience only — authorization
// always hits the DB, and this redirect is a UI convenience too, not a real
// authorization check. Route groups like (teacher)/(admin) are purely
// organizational and don't affect the URL, so role gating here is keyed by
// literal path, not by route-group prefix (see docs/implementation-plan.md
// Step 3's frontend note on /reset-codes being one page shared by two roles).
const ROUTE_ROLES: Record<string, Role[]> = {
  "/reset-codes": ["teacher", "admin"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const allowedRoles = ROUTE_ROLES[pathname];
  if (!allowedRoles) return NextResponse.next();

  const token = request.cookies.get(SESSION_TOKEN_COOKIE)?.value;
  const meResponse = await fetch(`${API_INTERNAL_URL}/auth/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!meResponse.ok) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { user } = (await meResponse.json()) as { user: { role: Role } };
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Next.js statically analyzes `matcher` at build time — it must be a literal
// array, not a computed expression like `Object.keys(ROUTE_ROLES)` (the
// latter is silently ignored). Keep this in sync with ROUTE_ROLES' keys.
export const config = {
  matcher: ["/reset-codes"],
};
