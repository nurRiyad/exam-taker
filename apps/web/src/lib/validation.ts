// Mirrors apps/api/src/validation/auth.ts's rules for instant client-side
// feedback. Deliberately duplicated rather than shared (ADR-0059 rules out a
// shared-types package for this) — the API always re-validates server-side.
export const BD_LOCAL_PHONE_REGEX = /^01[3-9]\d{8}$/;
export const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_]*$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUsername(value: string): string | undefined {
  if (value.length < 3) return "Username must be at least 3 characters";
  if (!USERNAME_REGEX.test(value)) {
    return "Username must start with a letter and contain only letters, numbers, and underscores";
  }
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!BD_LOCAL_PHONE_REGEX.test(value)) {
    return "Enter a valid Bangladeshi mobile number, e.g. 01712345678";
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (value.length < 6) return "Password must be at least 6 characters";
  return undefined;
}
