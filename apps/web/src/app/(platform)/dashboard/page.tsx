import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@exam-taker/api/src/types";
import { SESSION_TOKEN_COOKIE } from "@/utils/session-token";
import { getCurrentUserFromServer } from "@/utils/api-client";

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  admin: "/admin/dashboard",
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value;

  const session = await getCurrentUserFromServer(token);
  if (!session) redirect("/login?next=/dashboard");

  const { user } = session;
  redirect(DASHBOARD_BY_ROLE[user.role]);
}
