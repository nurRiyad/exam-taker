"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getSessionToken, subscribeSessionToken } from "@/utils/session-token";

export function NavbarBrandLink() {
  const hasToken = useSyncExternalStore(
    subscribeSessionToken,
    () => Boolean(getSessionToken()),
    () => false,
  );

  return (
    <Link
      href={hasToken ? "/dashboard" : "/"}
      className="min-w-0 shrink text-sm font-bold tracking-tight text-violet-800 underline-offset-4 hover:underline sm:text-base"
    >
      এক্সাম টেকার
    </Link>
  );
}
