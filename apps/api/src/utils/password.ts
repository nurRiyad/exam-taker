// PBKDF2-SHA256 password hashing via Web Crypto (ADR-0054) — bcrypt/argon2 need a WASM
// dependency that doesn't fit Workers' CPU-time budget well; PBKDF2 is native here.
//
// Iteration count is a CPU-time-vs-security tradeoff for Workers, not an ADR-mandated
// number. It travels with each hash, so raising it later never breaks existing hashes.
import { timingSafeEqual } from "hono/utils/buffer";

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const DERIVED_KEY_BITS = 256;

const HEX_PAIR = /^[0-9a-f]+$/i;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !HEX_PAIR.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function deriveBits(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    DERIVED_KEY_BITS,
  );
  return new Uint8Array(bits);
}

/** Encoded as `pbkdf2$<iterations>$<saltHex>$<hashHex>` per ADR-0054. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await deriveBits(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;

  const iterations = Number.parseInt(parts[1], 10);
  if (!Number.isInteger(iterations) || iterations <= 0) return false;

  const salt = fromHex(parts[2]);
  if (!salt || !HEX_PAIR.test(parts[3])) return false;

  const actual = await deriveBits(password, salt, iterations);
  // hono's timingSafeEqual compares strings directly and is safe against
  // length mismatches by construction — no manual length guard needed.
  return timingSafeEqual(toHex(actual), parts[3]);
}
