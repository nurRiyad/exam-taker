// ADR-0017 / ADR-0049: username/phone/email rules, password rules, one-screen
// signup. The DB's CHECK constraint on `users.username` only enforces min
// length + first-char-is-letter (SQLite GLOB can't express charset rules), so
// the letters/numbers/underscores-only rule must be enforced here too.
import { z } from "zod";
import { BD_LOCAL_PHONE_REGEX } from "../lib/phone";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .regex(/^[A-Za-z][A-Za-z0-9_]*$/, "Username must start with a letter and contain only letters, numbers, and underscores");

export const phoneLocalSchema = z
  .string()
  .regex(BD_LOCAL_PHONE_REGEX, "Enter a valid Bangladeshi mobile number, e.g. 01712345678");

export const emailSchema = z.string().email("Enter a valid email address");

// Min length 6, deliberately no composition rule (ADR-0020).
export const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    username: usernameSchema,
    phone: phoneLocalSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your username, phone, or email"),
  password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const generateResetCodeSchema = z.object({
  userId: z.string().min(1),
});

export type GenerateResetCodeInput = z.infer<typeof generateResetCodeSchema>;

export const redeemResetCodeSchema = z
  .object({
    identifier: z.string().min(1, "Enter your username, phone, or email"),
    code: z.string().length(6, "Enter the 6-digit reset code"),
    newPassword: passwordSchema,
    newPasswordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match",
    path: ["newPasswordConfirmation"],
  });

export type RedeemResetCodeInput = z.infer<typeof redeemResetCodeSchema>;
