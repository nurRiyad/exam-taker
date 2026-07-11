import { describe, expect, it } from "vitest";
import { makeProfilePlaceholderEmail, toPublicUser } from "./user";

describe("user response shaping", () => {
  it("hides generated signup placeholders as incomplete profile fields", () => {
    const user = toPublicUser({
      id: "user-1",
      name: "new_teacher",
      username: "new_teacher",
      phoneE164: "+8801712345678",
      email: makeProfilePlaceholderEmail("new_teacher"),
      passwordHash: "hidden",
      role: "teacher",
      city: null,
      institution: null,
      status: "active",
      createdAt: "2026-07-11 00:00:00",
    });

    expect(user.name).toBeNull();
    expect(user.email).toBeNull();
    expect(user.phone).toBe("01712345678");
  });
});
