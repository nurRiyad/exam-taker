// Username is retained as the teacher page slug during teacher signup. Login
// credentials are email or phone; students also supply their teacher page slug.
import { z } from "zod";
import { BD_LOCAL_PHONE_REGEX } from "./phone";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .regex(
    /^[A-Za-z][A-Za-z0-9_]*$/,
    "Username must start with a letter and contain only letters, numbers, and underscores",
  );

export const phoneLocalSchema = z
  .string()
  .regex(BD_LOCAL_PHONE_REGEX, "Enter a valid Bangladeshi mobile number, e.g. 01712345678");

export const emailSchema = z.string().email("Enter a valid email address");

// Min length 6, deliberately no composition rule.
export const passwordSchema = z
  .string()
  .min(5, "Password must be at least 5 characters")
  .max(20, "Password must be at most 20 characters");

export const signupSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    username: usernameSchema.optional(),
    email: emailSchema,
    phone: phoneLocalSchema,
    role: z.enum(["student", "teacher"]).default("student"),
    tenantSlug: z.string().min(1).optional(),
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  })
  .superRefine((data, ctx) => {
    if (data.role === "teacher" && !data.username) {
      ctx.addIssue({ code: "custom", path: ["username"], message: "Teacher page username is required" });
    }
    if (data.role === "student" && !data.tenantSlug) {
      ctx.addIssue({ code: "custom", path: ["tenantSlug"], message: "Teacher page is required" });
    }
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your email or phone"),
  password: z.string().min(1, "Enter your password"),
  tenantSlug: z.string().min(1).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const generateResetCodeSchema = z.object({
  userId: z.string().min(1),
});

export type GenerateResetCodeInput = z.infer<typeof generateResetCodeSchema>;

export const redeemResetCodeSchema = z
  .object({
    identifier: z.string().min(1, "Enter your email or phone"),
    code: z.string().length(6, "Enter the 6-digit reset code"),
    newPassword: passwordSchema,
    newPasswordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match",
    path: ["newPasswordConfirmation"],
  });

export type RedeemResetCodeInput = z.infer<typeof redeemResetCodeSchema>;
