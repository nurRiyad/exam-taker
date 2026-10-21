// Pure business logic — no Hono imports. Callers (controllers) pass a
// `Database` handle and plain values, never a Hono `Context`, so this file
// stays unit-testable without mocking cookies/env/HTTPException.
import type { Database } from "@exam-taker/db";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../utils/errors";
import { hashPassword, verifyPassword } from "../../utils/password";
import { normalizePhoneToE164 } from "../../utils/phone";
import { generateResetCode as generateResetCodeValue, hashResetCode, verifyResetCode } from "../../utils/reset-code";
import { formatSqliteTimestamp } from "../../utils/sqlite-time";
import { toPublicStudent, toPublicUser, type PublicUser } from "../../utils/user";
import * as courseEnrollmentsRepository from "../courses/course-enrollments.repository";
import * as resetCodesRepository from "./reset-codes.repository";
import * as tenantsRepository from "../tenants/tenants.repository";
import * as teacherMembershipsRepository from "../tenants/teacher-memberships.repository";
import * as usersRepository from "./users.repository";
import * as tenantsService from "../tenants/tenants.service";
import * as studentsRepository from "./students.repository";
import type {
  GenerateResetCodeInput,
  LoginInput,
  RedeemResetCodeInput,
  SignupInput,
} from "@exam-taker/validation/auth";

// Same message regardless of *why* login/reset failed — user not found, wrong
// password/code, expired code, inactive account — so neither endpoint leaks
// which identifiers exist.
const VAGUE_LOGIN_ERROR = "Incorrect email/phone or password";
const VAGUE_RESET_ERROR = "Invalid or expired reset code";
const RESET_CODE_TTL_MS = 60 * 60 * 1000; // 1 hour

function tenantSlugFromUsername(username: string): string {
  return username.toLowerCase().replaceAll("_", "-");
}

export async function checkUsernameAvailability(db: Database, username: string): Promise<boolean> {
  const existing = await usersRepository.findByUsername(db, username);
  return !existing;
}

export async function signup(db: Database, input: SignupInput): Promise<{ user: PublicUser; tenantId?: string }> {
  const phoneE164 = normalizePhoneToE164(input.phone);
  const email = input.email.trim().toLowerCase();

  if (input.role === "student") {
    const page = await tenantsRepository.findPageBySlug(db, input.tenantSlug!);
    if (!page || page.status !== "active") throw new NotFoundError("Teacher page not found");
    const conflicts = await studentsRepository.findConflicts(db, page.id, email, phoneE164);
    const fields: Record<string, string> = {};
    if (conflicts.some((student) => student.email === email))
      fields.email = "Email is already registered on this teacher page";
    if (conflicts.some((student) => student.phoneE164 === phoneE164))
      fields.phone = "Phone number is already registered on this teacher page";
    if (Object.keys(fields).length) throw new ConflictError("Some fields are already taken", fields);

    try {
      const row = await studentsRepository.insert(db, {
        tenantId: page.id,
        name: input.name?.trim() || email.split("@")[0],
        email,
        phoneE164,
        passwordHash: await hashPassword(input.password),
      });
      return { user: toPublicStudent(row, page.slug), tenantId: page.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (!message.includes("UNIQUE constraint failed")) throw err;
      throw new ConflictError("Some fields are already taken", {
        email: "Email or phone is already registered on this teacher page",
      });
    }
  }

  const username = input.username!;
  const tenantSlug = tenantSlugFromUsername(username);

  // Explicit, field-level conflict errors on signup — the deliberate
  // opposite of login's vague errors.
  const conflicts = await usersRepository.findConflicts(db, { username, phoneE164, email });
  const fields: Record<string, string> = {};
  if (conflicts.some((u) => u.username === input.username)) fields.username = "Username is already taken";
  if (conflicts.some((u) => u.phoneE164 === phoneE164)) fields.phone = "Phone number is already registered";
  if (conflicts.some((u) => u.email === email)) fields.email = "Email is already registered";
  if (tenantSlug && (await tenantsRepository.findBySlug(db, tenantSlug))) {
    fields.username = "Username is already taken";
  }
  if (Object.keys(fields).length > 0) {
    throw new ConflictError("Some fields are already taken", fields);
  }

  const passwordHash = await hashPassword(input.password);

  try {
    const user = await usersRepository.insert(db, {
      name: input.name?.trim() || username,
      username,
      phoneE164,
      email,
      passwordHash,
      role: input.role,
    });
    if (input.role === "teacher" && tenantSlug) {
      await tenantsService.createTenant(db, {
        name: input.name?.trim() || username,
        slug: tenantSlug,
        ownerUserId: user.id,
      });
    }
    const page = await tenantsRepository.findPageBySlug(db, tenantSlug);
    return { user: toPublicUser(user, page), tenantId: page?.id };
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
    if (message.includes("tenants.slug")) raceFields.username = "Username is already taken";
    throw new ConflictError(
      "Some fields are already taken",
      Object.keys(raceFields).length > 0 ? raceFields : { username: "Already taken" },
    );
  }
}

export async function login(db: Database, input: LoginInput): Promise<{ user: PublicUser; tenantId?: string }> {
  const identifier = input.identifier.trim();
  if (input.tenantSlug) {
    const page = await tenantsRepository.findPageBySlug(db, input.tenantSlug);
    if (!page || page.status !== "active") throw new UnauthorizedError(VAGUE_LOGIN_ERROR);
    const candidateE164 = /^01[3-9]\d{8}$/.test(identifier) ? normalizePhoneToE164(identifier) : undefined;
    const student = await studentsRepository.findByTenantAndIdentifier(db, page.id, identifier, candidateE164);
    if (!student || student.status !== "active" || !(await verifyPassword(input.password, student.passwordHash))) {
      throw new UnauthorizedError(VAGUE_LOGIN_ERROR);
    }
    return { user: toPublicStudent(student, page.slug), tenantId: page.id };
  }

  const user = await usersRepository.findByIdentifier(db, identifier);
  if (!user || (user.role !== "admin" && user.role !== "teacher")) throw new UnauthorizedError(VAGUE_LOGIN_ERROR);

  const passwordValid = await verifyPassword(input.password, user.passwordHash);
  if (!passwordValid || user.status !== "active") {
    throw new UnauthorizedError(VAGUE_LOGIN_ERROR);
  }

  const membership = user.role === "teacher" ? await teacherMembershipsRepository.findByUserId(db, user.id) : undefined;
  const page = membership ? await tenantsRepository.findById(db, membership.tenantId) : undefined;
  return { user: toPublicUser(user, page ? { id: page.id, slug: page.slug } : undefined), tenantId: page?.id };
}

export async function generateResetCode(
  db: Database,
  input: GenerateResetCodeInput,
  generatedBy: PublicUser,
): Promise<{ code: string }> {
  const target = await usersRepository.findById(db, input.userId);
  if (!target || target.role !== "student") {
    throw new NotFoundError("Student not found");
  }

  // Restricts teacher-generated codes to students in the teacher's
  // own courses; admins have no tenant of their own and are exempt.
  if (generatedBy.role === "teacher") {
    const membership = await teacherMembershipsRepository.findByUserId(db, generatedBy.id);
    const enrolled = membership
      ? await courseEnrollmentsRepository.existsForTenantAndStudent(db, membership.tenantId, target.id)
      : false;
    if (!enrolled) throw new ForbiddenError("Student is not enrolled in any of your courses");
  }

  const code = generateResetCodeValue();
  const codeHash = await hashResetCode(code);
  const expiresAt = formatSqliteTimestamp(new Date(Date.now() + RESET_CODE_TTL_MS));

  await resetCodesRepository.insert(db, {
    userId: target.id,
    codeHash,
    generatedByUserId: generatedBy.id,
    expiresAt,
  });

  // Plaintext code, returned once, for manual out-of-platform delivery
  // (WhatsApp/phone) — never stored or logged in plaintext.
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
