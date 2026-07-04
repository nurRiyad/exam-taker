import { eq, or } from "drizzle-orm";
import type { Database } from "../db/client";
import { users } from "../db/schema";
import { BD_LOCAL_PHONE_REGEX, normalizePhoneToE164 } from "../utils/phone";

type UserRow = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;

/** Login/reset both accept a username, phone (local or E.164), or email.
 * Email is matched case-insensitively (stored lowercase, see `insert`) —
 * username and phone are matched verbatim, unaffected. */
function byIdentifier(identifier: string) {
  const candidateE164 = BD_LOCAL_PHONE_REGEX.test(identifier) ? normalizePhoneToE164(identifier) : undefined;
  return or(
    eq(users.username, identifier),
    eq(users.email, identifier.toLowerCase()),
    eq(users.phoneE164, identifier),
    candidateE164 ? eq(users.phoneE164, candidateE164) : undefined,
  );
}

export async function findByIdentifier(db: Database, identifier: string): Promise<UserRow | undefined> {
  const [user] = await db.select().from(users).where(byIdentifier(identifier)).limit(1);
  return user;
}

export async function findById(db: Database, id: string): Promise<UserRow | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function findByUsername(db: Database, username: string): Promise<Pick<UserRow, "id"> | undefined> {
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
  return existing;
}

export async function findConflicts(
  db: Database,
  { username, phoneE164, email }: { username: string; phoneE164: string; email: string },
): Promise<Array<Pick<UserRow, "username" | "phoneE164" | "email">>> {
  return db
    .select({ username: users.username, phoneE164: users.phoneE164, email: users.email })
    .from(users)
    .where(or(eq(users.username, username), eq(users.phoneE164, phoneE164), eq(users.email, email)));
}

export async function insert(db: Database, data: NewUser): Promise<UserRow> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

/** Non-async: returns the unexecuted query so callers can compose it into a
 * `db.batch([...])` alongside another table's statement (see
 * `services/auth.service.ts`'s `redeemResetCode`). */
export function updatePasswordQuery(db: Database, userId: string, passwordHash: string) {
  return db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}
