"use client";

import { LogOutIcon, SettingsIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearSessionToken } from "@/utils/session-token";

export function NavbarProfileDropdown({ label }: { label: string }) {
  const router = useRouter();
  const logout = useLogoutMutation();

  async function handleLogout() {
    try {
      await logout.mutateAsync();
    } finally {
      clearSessionToken();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${label} এর প্রোফাইল মেনু`}
        render={
          <Button
            size="icon"
            variant="outline"
            className="size-10 rounded-full border-violet-200 bg-violet-50 p-0 text-sm font-semibold text-violet-800 hover:bg-violet-100"
          />
        }
      >
        <span aria-hidden="true">{Array.from(label.trim())[0] ?? "অ"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2">
            <span className="block truncate text-sm font-semibold text-foreground">{label}</span>
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">আপনার অ্যাকাউন্ট</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full" render={<Link href="/teacher/profile" />}>
            <UserRoundIcon data-icon="inline-start" />
            শিক্ষক প্রোফাইল
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full" render={<Link href="/settings" />}>
            <SettingsIcon data-icon="inline-start" />
            সেটিংস
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full" nativeButton render={<button type="button" />} onClick={handleLogout}>
            <LogOutIcon data-icon="inline-start" />
            লগআউট
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
