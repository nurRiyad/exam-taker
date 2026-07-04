import { sign } from "hono/jwt";
import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "./jwt";

const SECRET = "test-secret";

describe("jwt session", () => {
  it("round-trips a signed session", async () => {
    const token = await signSession({ sub: "user-1", role: "student" }, SECRET);
    const payload = await verifySession(token, SECRET);
    expect(payload).toEqual({ sub: "user-1", role: "student" });
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signSession({ sub: "user-1", role: "student" }, SECRET);
    await expect(verifySession(token, "wrong-secret")).resolves.toBeNull();
  });

  it("rejects a tampered token", async () => {
    const token = await signSession({ sub: "user-1", role: "student" }, SECRET);
    const [header, payload, signature] = token.split(".");
    const tampered = `${header}.${payload}x.${signature}`;
    await expect(verifySession(tampered, SECRET)).resolves.toBeNull();
  });

  it("rejects an expired token", async () => {
    const expiredExp = Math.floor(Date.now() / 1000) - 60;
    const expiredToken = await sign({ sub: "user-1", role: "student", exp: expiredExp }, SECRET, "HS256");
    await expect(verifySession(expiredToken, SECRET)).resolves.toBeNull();
  });

  it("rejects a payload missing the expected shape", async () => {
    const malformedToken = await sign({ exp: Math.floor(Date.now() / 1000) + 60 }, SECRET, "HS256");
    await expect(verifySession(malformedToken, SECRET)).resolves.toBeNull();
  });
});
