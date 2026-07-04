// Pure business logic — no Hono imports. Callers (controllers) pass a
// `Database` handle and plain values, never a Hono `Context`, so this file
// stays unit-testable without mocking cookies/env/HTTPException.
import type { Database } from "../db/client";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../utils/errors";
import { hashPassword, verifyPassword } from "../utils/password";
import { normalizePhoneToE164 } from "../utils/phone";
import { generateResetCode as generateResetCodeValue, hashResetCode, verifyResetCode } from "../utils/reset-code";
import { formatSqliteTimestamp } from "../utils/sqlite-time";
import { toPublicUser, type PublicUser } from "../utils/user";
import * as resetCodesRepository from "../repositories/reset-codes.repository";
import * as usersRepository from "../repositories/users.repository";
import type { GenerateResetCodeInput, LoginInput, RedeemResetCodeInput, SignupInput } from "../validation/auth";

// Same message regardless of *why* login/reset failed — user not found, wrong
// password/code, expired code, inactive account — so neither endpoint leaks
// which identifiers exist (ADR-0020/0049's "vague login errors" requirement,
// extended here to reset redemption for the same reason).
const VAGUE_LOGIN_ERROR = "Incorrect username/phone/email or password";
const VAGUE_RESET_ERROR = "Invalid or expired reset code";
const RESET_CODE_TTL_MS = 60 * 60 * 1000; // 1 hour, ADR-0025

export async function checkUsernameAvailability(db: Database, username: string): Promise<boolean> {
  const existing = await usersRepository.findByUsername(db, username);
  return !existing;
}

export async function signup(db: Database, input: SignupInput): Promise<PublicUser> {
  const phoneE164 = normalizePhoneToE164(input.phone);
  const email = input.email.toLowerCase(); // stored lowercase so login/reset can match case-insensitively

  // Explicit, field-level conflict errors on signup — the deliberate
  // opposite of login's vague errors (ADR-0049).
  const conflicts = await usersRepository.findConflicts(db, { username: input.username, phoneE164, email });
  const fields: Record<string, string> = {};
  if (conflicts.some((u) => u.username === input.username)) fields.username = "Username is already taken";
  if (conflicts.some((u) => u.phoneE164 === phoneE164)) fields.phone = "Phone number is already registered";
  if (conflicts.some((u) => u.email === email)) fields.email = "Email is already registered";
  if (Object.keys(fields).length > 0) {
    throw new ConflictError("Some fields are already taken", fields);
  }

  const passwordHash = await hashPassword(input.password);

  try {
    const user = await usersRepository.insert(db, {
      name: input.name,
      username: input.username,
      phoneE164,
      email,
      passwordHash,
      role: "student", // Public signup only ever creates students; teachers/admins are provisioned out-of-band (Step 4).
    });
    return toPublicUser(user);
  } catch (err) {
    // The conflict check above has a check-then-insert race: two concurrent
    // signups for the same identity can both pass it. Fall back to the DB's
    // own UNIQUE constraint as the final source of truth and translate its
    // failure into the same structured conflict error instead of a raw 500.
    const message = err instanceof Error ? err.message : "";
    if (!message.includes("UNIQUE constraint failed")) throw err;

    const raceFields: Record<string, string> = {};
    if (message.includes("users.username")) raceFields.username = "Username is already taken";
    if (message.includes("users.phone_e164")) raceFields.phone = "Phone number is already registered";
    if (message.includes("users.email")) raceFields.email = "Email is already registered";
    throw new ConflictError(
      "Some fields are already taken",
      Object.keys(raceFields).length > 0 ? raceFields : { username: "Already taken" },
    );
  }
}

export async function login(db: Database, input: LoginInput): Promise<PublicUser> {
  const user = await usersRepository.findByIdentifier(db, input.identifier);
  if (!user) throw new UnauthorizedError(VAGUE_LOGIN_ERROR);

  const passwordValid = await verifyPassword(input.password, user.passwordHash);
  if (!passwordValid || user.status !== "active") {
    throw new UnauthorizedError(VAGUE_LOGIN_ERROR);
  }

  return toPublicUser(user);
}

export async function generateResetCode(
  db: Database,
  input: GenerateResetCodeInput,
  generatedByUserId: string,
): Promise<{ code: string }> {
  const target = await usersRepository.findById(db, input.userId);
  if (!target || target.role !== "student") {
    throw new NotFoundError("Student not found");
  }
  // NOTE: ADR-0025 restricts teacher-generated codes to "students in their
  // courses," but course_enrollments doesn't exist until Step 4, so that
  // check is a no-op here — any teacher/admin can generate for any student.
  // Tracked as a Step 4 backend task in docs/implementation-plan.md
  // (search "tighten Step 3's POST /auth/reset-codes").

  const code = generateResetCodeValue();
  const codeHash = await hashResetCode(code);
  const expiresAt = formatSqliteTimestamp(new Date(Date.now() + RESET_CODE_TTL_MS));

  await resetCodesRepository.insert(db, {
    userId: target.id,
    codeHash,
    generatedByUserId,
    expiresAt,
  });

  // Plaintext code, returned once, for manual out-of-platform delivery
  // (WhatsApp/phone) — never stored or logged in plaintext (ADR-0025).
  return { code };
}

export async function redeemResetCode(db: Database, input: RedeemResetCodeInput): Promise<void> {
  const user = await usersRepository.findByIdentifier(db, input.identifier);
  // A blocked/deactivated account must not be able to reactivate itself via
  // an outstanding reset code — same gate `login` applies.
  if (!user || user.status !== "active") throw new BadRequestError(VAGUE_RESET_ERROR);

  const now = formatSqliteTimestamp(new Date());
  const candidates = await resetCodesRepository.findValidCandidates(db, user.id, now);

  let codeRow: (typeof candidates)[number] | undefined;
  for (const candidate of candidates) {
    if (await verifyResetCode(input.code, candidate.codeHash)) {
      codeRow = candidate;
      break;
    }
  }
  if (!codeRow) throw new BadRequestError(VAGUE_RESET_ERROR);

  const newPasswordHash = await hashPassword(input.newPassword);
  const usedAt = formatSqliteTimestamp(new Date());

  await db.batch([
    usersRepository.updatePasswordQuery(db, user.id, newPasswordHash),
    resetCodesRepository.markUsedQuery(db, codeRow.id, usedAt),
  ]);
}
