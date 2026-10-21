"use client";

import Link from "next/link";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/features/auth/queries";
import { useCurrentUserQuery } from "@/features/auth/queries";
import { clearSessionToken, getSessionToken, subscribeSessionToken } from "@/utils/session-token";
import { useSyncExternalStore } from "react";

export function NavbarMobileAccountItems() {
  const hasToken = useSyncExternalStore(
    subscribeSessionToken,
    () => Boolean(getSessionToken()),
    () => false,
  );
  const currentUser = useCurrentUserQuery(hasToken);
  const logout = useLogoutMutation();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout.mutateAsync();
    } finally {
      clearSessionToken();
      router.push("/login");
      router.refresh();
    }
  }

  if (!hasToken) {
    return (
      <>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/login" />}>লগইন</DropdownMenuItem>
      </>
    );
  }

  const user = currentUser.data?.user;
  const label = user?.name ?? user?.username ?? "অ্যাকাউন্ট";

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel className="px-2 py-2">
          <span className="block truncate text-sm font-semibold text-foreground">{label}</span>
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">আপনার অ্যাকাউন্ট</span>
        </DropdownMenuLabel>
        <DropdownMenuItem render={<Link href="/settings" />}>
          <SettingsIcon data-icon="inline-start" />
          সেটিংস
        </DropdownMenuItem>
        <DropdownMenuItem nativeButton render={<button type="button" />} onClick={handleLogout}>
          <LogOutIcon data-icon="inline-start" />
          লগআউট
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
}
