"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { NavbarProfileDropdown } from "@/components/navbar-profile-dropdown";
import { buttonVariants } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { getSessionToken, subscribeSessionToken } from "@/lib/session-token";
import { cn } from "@/lib/utils";

type NavbarUser = {
  name: string | null;
  username: string;
};

function getSnapshot() {
  return Boolean(getSessionToken());
}

function getServerSnapshot() {
  return false;
}

export function NavbarAccountAction() {
  const hasToken = useSyncExternalStore(subscribeSessionToken, getSnapshot, getServerSnapshot);
  const [user, setUser] = useState<NavbarUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!hasToken) return;

    async function loadUser() {
      try {
        const res = await apiClient.auth.me.$get();
        if (!res.ok) {
          if (!cancelled) setUser(null);
          return;
        }
        const data = await res.json();
        if (!cancelled) setUser({ name: data.user.name, username: data.user.username });
      } catch {
        if (!cancelled) setUser(null);
      }
    }

    void loadUser();
    return () => {
      cancelled = true;
    };
  }, [hasToken]);

  if (hasToken) {
    return <NavbarProfileDropdown label={user?.name ?? user?.username ?? "Account"} />;
  }

  return (
    <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
      Login
    </Link>
  );
}
