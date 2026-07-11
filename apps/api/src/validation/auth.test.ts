import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./auth";

describe("auth validation", () => {
  it("accepts signup without name or email and defaults to student", () => {
    const parsed = signupSchema.parse({
      username: "student_one",
      phone: "01712345678",
      password: "secret1",
      passwordConfirmation: "secret1",
    });

    expect(parsed).toMatchObject({
      username: "student_one",
      phone: "01712345678",
      role: "student",
    });
  });

  it("accepts teacher signup", () => {
    const parsed = signupSchema.parse({
      username: "teacher_one",
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

  it("describes login as username or phone only", () => {
    const result = loginSchema.safeParse({ identifier: "", password: "secret1" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Enter your username or phone");
  });
});