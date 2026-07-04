import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { getDb } from "../db/client";
import { resetCodes, users } from "../db/schema";
import { clearSessionCookie, setSessionCookie, signSession } from "../lib/jwt";
import { BD_LOCAL_PHONE_REGEX, normalizePhoneToE164 } from "../lib/phone";
import { hashPassword, verifyPassword } from "../lib/password";
import { generateResetCode, hashResetCode, verifyResetCode } from "../lib/reset-code";
import { formatSqliteTimestamp } from "../lib/sqlite-time";
import { toPublicUser } from "../lib/user";
import { requireAuth, requireRole, type AuthEnv } from "../middleware/auth";
import {
  generateResetCodeSchema,
  loginSchema,
  redeemResetCodeSchema,
  signupSchema,
  usernameSchema,
} from "../validation/auth";

// Same message regardless of *why* login/reset failed — user not found, wrong
// password/code, expired code, inactive account — so neither endpoint leaks
// which identifiers exist (ADR-0020/0049's "vague login errors" requirement,
// extended here to reset redemption for the same reason).
const VAGUE_LOGIN_ERROR = "Incorrect username/phone/email or password";
const VAGUE_RESET_ERROR = "Invalid or expired reset code";
const RESET_CODE_TTL_MS = 60 * 60 * 1000; // 1 hour, ADR-0025

/** Login/reset both accept a username, phone (local or E.164), or email.
 * Email is matched case-insensitively (stored lowercase, see /signup) —
 * username and phone are matched verbatim, unaffected. */
function byIdentifier(identifier: string) {
  const candidateE164 = BD_LOCAL_PHONE_REGEX.test(identifier) ? normalizePhoneToE164(identifier) : undefined;
  return or(
    eq(users.username, identifier),
    eq(users.email, identifier.toLowerCase()),
    eq(users.phoneE164, identifier),
    candidateE164 ? eq(users.phoneE164, candidateE164) : undefined,
  );
}

/** Used at both the pre-insert conflict check and the race-condition fallback
 * below — a concurrent duplicate signup can slip past the pre-check and only
 * get caught by the DB's own UNIQUE constraint on insert. */
function fieldConflictError(c: Context, fields: Record<string, string>): HTTPException {
  return new HTTPException(409, { res: c.json({ error: "Some fields are already taken", fields }, 409) });
}

export const authRoutes = new Hono<AuthEnv>()
  .get("/username-availability", zValidator("query", z.object({ username: usernameSchema })), async (c) => {
    const { username } = c.req.valid("query");
    const db = getDb(c.env.DB);
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
    return c.json({ available: !existing });
  })
  .post("/signup", zValidator("json", signupSchema), async (c) => {
    const data = c.req.valid("json");
    const phoneE164 = normalizePhoneToE164(data.phone);
    const email = data.email.toLowerCase(); // stored lowercase so login/reset can match case-insensitively
    const db = getDb(c.env.DB);

    // Explicit, field-level conflict errors on signup — the deliberate
    // opposite of login's vague errors (ADR-0049).
    const conflicts = await db
      .select({ username: users.username, phoneE164: users.phoneE164, email: users.email })
      .from(users)
      .where(or(eq(users.username, data.username), eq(users.phoneE164, phoneE164), eq(users.email, email)));

    const fields: Record<string, string> = {};
    if (conflicts.some((u) => u.username === data.username)) fields.username = "Username is already taken";
    if (conflicts.some((u) => u.phoneE164 === phoneE164)) fields.phone = "Phone number is already registered";
    if (conflicts.some((u) => u.email === email)) fields.email = "Email is already registered";
    if (Object.keys(fields).length > 0) {
      throw fieldConflictError(c, fields);
    }

    const passwordHash = await hashPassword(data.password);

    let user: typeof users.$inferSelect;
    try {
      [user] = await db
        .insert(users)
        .values({
          name: data.name,
          username: data.username,
          phoneE164,
          email,
          passwordHash,
          role: "student", // Public signup only ever creates students; teachers/admins are provisioned out-of-band (Step 4).
        })
        .returning();
    } catch (err) {
      // The conflict check above has a check-then-insert race: two concurrent
      // signups for the same identity can both pass it. Fall back to the
      // DB's own UNIQUE constraint as the final source of truth and translate
      // its failure into the same structured 409 instead of a raw 500.
      const message = err instanceof Error ? err.message : "";
      if (!message.includes("UNIQUE constraint failed")) throw err;

      const raceFields: Record<string, string> = {};
      if (message.includes("users.username")) raceFields.username = "Username is already taken";
      if (message.includes("users.phone_e164")) raceFields.phone = "Phone number is already registered";
      if (message.includes("users.email")) raceFields.email = "Email is already registered";
      throw fieldConflictError(c, Object.keys(raceFields).length > 0 ? raceFields : { username: "Already taken" });
    }

    const token = await signSession({ sub: user.id, role: user.role }, c.env.JWT_SECRET);
    setSessionCookie(c, token);
    return c.json({ user: toPublicUser(user) }, 201);
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const data = c.req.valid("json");
    const db = getDb(c.env.DB);

    const [user] = await db.select().from(users).where(byIdentifier(data.identifier)).limit(1);
    if (!user) throw new HTTPException(401, { message: VAGUE_LOGIN_ERROR });

    const passwordValid = await verifyPassword(data.password, user.passwordHash);
    if (!passwordValid || user.status !== "active") {
      throw new HTTPException(401, { message: VAGUE_LOGIN_ERROR });
    }

    const token = await signSession({ sub: user.id, role: user.role }, c.env.JWT_SECRET);
    setSessionCookie(c, token);
    return c.json({ user: toPublicUser(user) });
  })
  .post("/logout", async (c) => {
    // No requireAuth: logout must succeed idempotently even for an expired
    // session or a deactivated/blocked account — it only clears the
    // requester's own cookie, nothing that needs authorization.
    clearSessionCookie(c);
    return c.body(null, 204);
  })
  .get("/me", requireAuth, async (c) => {
    return c.json({ user: c.get("user") });
  })
  .post("/reset-codes", requireRole("teacher", "admin"), zValidator("json", generateResetCodeSchema), async (c) => {
    const { userId } = c.req.valid("json");
    const db = getDb(c.env.DB);

    const [target] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!target || target.role !== "student") {
      throw new HTTPException(404, { message: "Student not found" });
    }
    // NOTE: ADR-0025 restricts teacher-generated codes to "students in their
    // courses," but course_enrollments doesn't exist until Step 4, so that
    // check is a no-op here — any teacher/admin can generate for any student.
    // Tracked as a Step 4 backend task in docs/implementation-plan.md
    // (search "tighten Step 3's POST /auth/reset-codes").

    const code = generateResetCode();
    const codeHash = await hashResetCode(code);
    const expiresAt = formatSqliteTimestamp(new Date(Date.now() + RESET_CODE_TTL_MS));

    await db.insert(resetCodes).values({
      userId: target.id,
      codeHash,
      generatedByUserId: c.get("user").id,
      expiresAt,
    });

    // Plaintext code, returned once, for manual out-of-platform delivery
    // (WhatsApp/phone) — never stored or logged in plaintext (ADR-0025).
    return c.json({ code }, 201);
  })
  .post("/reset", zValidator("json", redeemResetCodeSchema), async (c) => {
    const data = c.req.valid("json");
    const db = getDb(c.env.DB);

    const [user] = await db.select().from(users).where(byIdentifier(data.identifier)).limit(1);
    // A blocked/deactivated account must not be able to reactivate itself via
    // an outstanding reset code — same gate /auth/login applies.
    if (!user || user.status !== "active") throw new HTTPException(400, { message: VAGUE_RESET_ERROR });

    const now = formatSqliteTimestamp(new Date());
    // A teacher/admin generating a second code (e.g. after a failed delivery)
    // must not invalidate an earlier still-valid one — check every
    // unused, unexpired code for this user, not just the most recent.
    const candidates = await db
      .select()
      .from(resetCodes)
      .where(and(eq(resetCodes.userId, user.id), isNull(resetCodes.usedAt), gt(resetCodes.expiresAt, now)))
      .orderBy(desc(resetCodes.createdAt));

    let codeRow: (typeof candidates)[number] | undefined;
    for (const candidate of candidates) {
      if (await verifyResetCode(data.code, candidate.codeHash)) {
        codeRow = candidate;
        break;
      }
    }
    if (!codeRow) throw new HTTPException(400, { message: VAGUE_RESET_ERROR });

    const newPasswordHash = await hashPassword(data.newPassword);
    const usedAt = formatSqliteTimestamp(new Date());

    await db.batch([
      db.update(users).set({ passwordHash: newPasswordHash }).where(eq(users.id, user.id)),
      db.update(resetCodes).set({ usedAt }).where(eq(resetCodes.id, codeRow.id)),
    ]);

    return c.json({ ok: true });
  });
