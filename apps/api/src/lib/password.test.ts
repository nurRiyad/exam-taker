import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("verifies a correct password against its own hash", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    await expect(verifyPassword("correct-horse-battery-staple", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });

  it("produces a different salt (and hash) for the same password each time", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a).not.toBe(b);
  });

  it("encodes the hash as pbkdf2$<iterations>$<salt>$<hash>", async () => {
    const hash = await hashPassword("whatever");
    const parts = hash.split("$");
    expect(parts).toHaveLength(4);
    expect(parts[0]).toBe("pbkdf2");
    expect(Number(parts[1])).toBeGreaterThan(0);
  });

  it.each([
    ["", "empty string"],
    ["not-pbkdf2$1$aa$bb", "wrong scheme tag"],
    ["pbkdf2$1$aa", "too few parts"],
    ["pbkdf2$notanumber$aa$bb", "non-numeric iterations"],
    ["pbkdf2$1$zz$bb", "non-hex salt"],
    ["pbkdf2$1$a$bb", "odd-length salt hex"],
  ])("rejects a malformed stored hash: %s (%s)", async (stored) => {
    await expect(verifyPassword("anything", stored)).resolves.toBe(false);
  });
});
