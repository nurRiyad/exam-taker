import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "api/src/types";
import { SESSION_TOKEN_COOKIE } from "@/lib/session-token";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8787";

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  admin: "/admin/dashboard",
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value;

  const meResponse = await fetch(`${API_INTERNAL_URL}/auth/me`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!meResponse.ok) redirect("/login?next=/dashboard");

  const { user } = (await meResponse.json()) as { user: { role: Role } };
  redirect(DASHBOARD_BY_ROLE[user.role]);
}