"use client";

import { LogOutIcon, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api-client";
import { clearSessionToken } from "@/lib/session-token";

export function NavbarProfileDropdown({ label }: { label: string }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await apiClient.auth.logout.$post();
    } finally {
      clearSessionToken();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="sm" variant="outline" className="max-w-32 justify-start sm:max-w-44" />}>
        <UserCircleIcon data-icon="inline-start" />
        <span className="truncate">{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/dashboard" />}>Dashboard</DropdownMenuItem>
          <DropdownMenuItem render={<button type="button" />} onClick={handleLogout}>
            <LogOutIcon data-icon="inline-start" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}