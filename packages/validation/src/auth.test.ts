import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./auth";

describe("auth validation", () => {
  it("requires a teacher portal for a student signup", () => {
    const parsed = signupSchema.parse({
      email: "student@example.com",
      phone: "01712345678",
      tenantSlug: "teacher-one",
      password: "secret1",
      passwordConfirmation: "secret1",
    });

    expect(parsed).toMatchObject({
      email: "student@example.com",
      phone: "01712345678",
      role: "student",
      tenantSlug: "teacher-one",
    });
  });

  it("accepts teacher signup", () => {
    const parsed = signupSchema.parse({
      username: "teacher_one",
      email: "teacher@example.com",
      phone: "01812345678",
      role: "teacher",
      password: "secret1",
      passwordConfirmation: "secret1",
    });

    expect(parsed.role).toBe("teacher");
  });

  it("does not allow admin signup", () => {
    expect(() =>
      signupSchema.parse({
        username: "admin_one",
        phone: "01912345678",
        role: "admin",
        password: "secret1",
        passwordConfirmation: "secret1",
      }),
    ).toThrow();
  });

  it("describes login as email or phone only", () => {
    const result = loginSchema.safeParse({ identifier: "", password: "secret1" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Enter your email or phone");
  });

  it("enforces the requested password length", () => {
    const common = {
      email: "student@example.com",
      phone: "01712345678",
      tenantSlug: "teacher-one",
      passwordConfirmation: "12345",
    };
    expect(signupSchema.safeParse({ ...common, password: "1234" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...common, password: "123456789012345678901" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...common, password: "12345" }).success).toBe(true);
  });
});
