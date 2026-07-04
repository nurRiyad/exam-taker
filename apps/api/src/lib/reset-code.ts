// Manual teacher/admin-assisted password reset codes (ADR-0025): short-lived,
// single-use, delivered by hand outside the platform (e.g. WhatsApp). A plain
// SHA-256 hash is sufficient here — unlike a password, this is a random,
// short-lived, single-use secret, so PBKDF2's deliberate slowness isn't needed.
import { sha256 } from "hono/utils/crypto";
import { timingSafeEqual } from "hono/utils/buffer";

const CODE_LENGTH = 6;

/** A 6-digit numeric code — easy to read aloud or type over WhatsApp/phone. */
export function generateResetCode(): string {
  const digits = crypto.getRandomValues(new Uint32Array(CODE_LENGTH));
  return Array.from(digits, (n) => (n % 10).toString()).join("");
}

export async function hashResetCode(code: string): Promise<string> {
  const hash = await sha256(code);
  // sha256() only returns null if crypto.subtle is unavailable — never true
  // on Workers or Node, but the type requires handling it.
  if (hash === null) throw new Error("SHA-256 hashing is unavailable in this runtime");
  return hash;
}

export async function verifyResetCode(code: string, hash: string): Promise<boolean> {
  return timingSafeEqual(await hashResetCode(code), hash);
}
