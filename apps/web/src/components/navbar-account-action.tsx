"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { NavbarProfileDropdown } from "@/components/navbar-profile-dropdown";
import { buttonVariants } from "@/components/ui/button";
import { useCurrentUserQuery } from "@/features/auth/queries";
import { getSessionToken, subscribeSessionToken } from "@/utils/session-token";
import { cn } from "@/utils/utils";

function getSnapshot() {
  return Boolean(getSessionToken());
}

function getServerSnapshot() {
  return false;
}

export function NavbarAccountAction() {
  const hasToken = useSyncExternalStore(subscribeSessionToken, getSnapshot, getServerSnapshot);
  const currentUser = useCurrentUserQuery(hasToken);
  const user = currentUser.data?.user;

  if (hasToken && currentUser.isPending) {
    return (
      <span
        role="status"
        aria-label="অ্যাকাউন্ট লোড হচ্ছে"
        className="block size-10 animate-pulse rounded-full border border-violet-100 bg-violet-50"
      >
        <span className="sr-only">অ্যাকাউন্ট লোড হচ্ছে…</span>
      </span>
    );
  }

  if (hasToken) {
    return <NavbarProfileDropdown label={user?.name ?? user?.username ?? "অ্যাকাউন্ট"} />;
  }

  return (
    <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
      লগইন
    </Link>
  );
}
