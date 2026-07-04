import { describe, expect, it } from "vitest";
import { generateResetCode, hashResetCode, verifyResetCode } from "./reset-code";

describe("reset-code", () => {
  it("generates a 6-digit numeric code", () => {
    const code = generateResetCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it("generates different codes across calls", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateResetCode()));
    expect(codes.size).toBeGreaterThan(1);
  });

  it("verifies a code against its own hash", async () => {
    const code = generateResetCode();
    const hash = await hashResetCode(code);
    await expect(verifyResetCode(code, hash)).resolves.toBe(true);
  });

  it("rejects an incorrect code", async () => {
    const hash = await hashResetCode("123456");
    await expect(verifyResetCode("654321", hash)).resolves.toBe(false);
  });
});
