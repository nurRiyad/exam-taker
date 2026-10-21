import type { Role } from "../../types";
import type { PublicUser } from "../../utils/user";

type DemoAccount = {
  username: string;
  password: string;
  user: PublicUser;
};

// Local walkthrough accounts only. The login route requires DEMO_AUTH_ENABLED=true,
// which belongs in the ignored apps/api/.dev.vars file and is not set in Wrangler config.
const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: "admin",
    password: "admin",
    user: {
      id: "demo-admin",
      name: "প্ল্যাটফর্ম অ্যাডমিন",
      username: "admin",
      phone: "01000000000",
      email: null,
      role: "admin",
      city: null,
      institution: null,
      status: "active",
      createdAt: "2026-10-21T00:00:00.000Z",
    },
  },
  {
    username: "kafi",
    password: "kafi",
    user: {
      id: "demo-teacher-kafi",
      name: "কাফি",
      username: "kafi",
      phone: "01000000001",
      email: null,
      role: "teacher",
      city: null,
      institution: null,
      status: "active",
      createdAt: "2026-10-21T00:00:00.000Z",
    },
  },
];

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

export function findDemoUser(username: string, password: string): PublicUser | undefined {
  return DEMO_ACCOUNTS.find(
    (account) =>
      constantTimeEqual(username.trim().toLowerCase(), account.username) &&
      constantTimeEqual(password, account.password),
  )?.user;
}

export function isDemoUsername(username: string): boolean {
  return DEMO_ACCOUNTS.some((account) => constantTimeEqual(username.trim().toLowerCase(), account.username));
}

export function findDemoUserById(id: string, role: Role): PublicUser | undefined {
  return DEMO_ACCOUNTS.find((account) => account.user.id === id && account.user.role === role)?.user;
}
