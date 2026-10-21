import type { users } from "@exam-taker/db/schema";
import type { students } from "@exam-taker/db/schema";
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
 * displays phone in local `01...` form. */
export function toPublicUser(row: UserRow, teacherPage?: { id: string; slug: string }) {
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
    tenantId: teacherPage?.id ?? null,
    teacherPageSlug: teacherPage?.slug ?? null,
  };
}

export function toPublicStudent(row: typeof students.$inferSelect, tenantSlug?: string) {
  return {
    id: row.id,
    name: row.name,
    username: row.email.split("@")[0] || `student-${row.id.slice(0, 6)}`,
    phone: denormalizePhoneToLocal(row.phoneE164),
    email: row.email,
    role: "student" as const,
    city: null,
    institution: null,
    status: row.status,
    createdAt: row.createdAt,
    tenantId: row.tenantId,
    teacherPageSlug: tenantSlug ?? null,
  };
}

export type PublicUser = ReturnType<typeof toPublicUser> | ReturnType<typeof toPublicStudent>;
