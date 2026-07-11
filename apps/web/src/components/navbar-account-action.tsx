"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getSessionToken } from "@/lib/session-token";
import { cn } from "@/lib/utils";

function subscribe() {
  return () => undefined;
}

function getSnapshot() {
  return Boolean(getSessionToken());
}

function getServerSnapshot() {
  return false;
}

export function NavbarAccountAction() {
  const hasToken = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (hasToken) {
    return (
      <Link href="/dashboard" className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
        Dashboard
      </Link>
    );
  }

  return (
    <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
      Login
    </Link>
  );
}