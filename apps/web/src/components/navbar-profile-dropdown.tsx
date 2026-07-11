"use client";

import { LogOutIcon, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { clearSessionToken } from "@/lib/session-token";

export function NavbarProfileDropdown({ label }: { label: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  async function handleLogout() {
    setOpen(false);
    try {
      await apiClient.auth.logout.$post();
    } finally {
      clearSessionToken();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="max-w-32 justify-start sm:max-w-44"
      >
        <UserCircleIcon data-icon="inline-start" />
        <span className="truncate">{label}</span>
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 flex w-44 flex-col overflow-hidden rounded-lg border bg-background p-1 text-sm shadow-lg"
        >
          <div className="truncate px-2 py-1.5 text-xs text-muted-foreground">{label}</div>
          <Link
            href="/dashboard"
            role="menuitem"
            className="rounded-md px-2 py-1.5 underline-offset-4 hover:bg-muted hover:underline"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-muted"
            onClick={handleLogout}
          >
            <LogOutIcon data-icon="inline-start" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}