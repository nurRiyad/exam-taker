import type { users } from "../db/schema";
import { denormalizePhoneToLocal } from "./phone";

type UserRow = typeof users.$inferSelect;
export const PROFILE_PLACEHOLDER_EMAIL_DOMAIN = "profile-pending.exam-taker.invalid";

export function makeProfilePlaceholderEmail(username: string): string {
  return `${username.toLowerCase()}@${PROFILE_PLACEHOLDER_EMAIL_DOMAIN}`;
}

function isProfilePlaceholderEmail(email: string): boolean {
  return email.endsWith(`@${PROFILE_PLACEHOLDER_EMAIL_DOMAIN}`);
}

/** Shapes a DB user row for API responses — never leaks `passwordHash`, always
 * displays phone in local `01...` form (ADR-0049). */
export function toPublicUser(row: UserRow) {
  return {
    id: row.id,
    name: row.name === row.username ? null : row.name,
    username: row.username,
    phone: denormalizePhoneToLocal(row.phoneE164),
    email: isProfilePlaceholderEmail(row.email) ? null : row.email,
    role: row.role,
    city: row.city,
    institution: row.institution,
    status: row.status,
    createdAt: row.createdAt,
  };
}

export type PublicUser = ReturnType<typeof toPublicUser>;
