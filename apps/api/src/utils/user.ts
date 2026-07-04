import type { users } from "../db/schema";
import { denormalizePhoneToLocal } from "./phone";

type UserRow = typeof users.$inferSelect;

/** Shapes a DB user row for API responses — never leaks `passwordHash`, always
 * displays phone in local `01...` form (ADR-0049). */
export function toPublicUser(row: UserRow) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    phone: denormalizePhoneToLocal(row.phoneE164),
    email: row.email,
    role: row.role,
    city: row.city,
    institution: row.institution,
    status: row.status,
    createdAt: row.createdAt,
  };
}

export type PublicUser = ReturnType<typeof toPublicUser>;
