"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarMobileAccountItems } from "@/components/navbar-mobile-account-items";
import { useCurrentUserQuery } from "@/features/auth/queries";
import { getSessionToken, subscribeSessionToken } from "@/utils/session-token";

const NAV_LINKS = [
  { href: "#সুবিধা", label: "সুবিধা" },
  { href: "#কীভাবে-কাজ-করে", label: "শুরু করুন" },
  { href: "#মূল্য", label: "মূল্য" },
] as const;

const ADMIN_LINKS = [
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
  { href: "/teachers", label: "শিক্ষক" },
  { href: "/courses", label: "কোর্স" },
] as const;

export function SiteNavbarLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const hasToken = useSyncExternalStore(
    subscribeSessionToken,
    () => Boolean(getSessionToken()),
    () => false,
  );
  const currentUser = useCurrentUserQuery(hasToken);

  if (hasToken && currentUser.isPending) {
    return (
      <div
        aria-label="নেভিগেশন লোড হচ্ছে"
        role="status"
        className={mobile ? "sm:hidden" : "hidden flex-1 items-center justify-center gap-5 sm:flex"}
      >
        <span className="h-4 w-16 animate-pulse rounded-full bg-violet-100" />
        <span className="h-4 w-14 animate-pulse rounded-full bg-violet-100" />
        <span className="h-4 w-12 animate-pulse rounded-full bg-violet-100" />
        <span className="sr-only">নেভিগেশন লোড হচ্ছে…</span>
      </div>
    );
  }

  const role = currentUser.data?.user.role;
  const links = !hasToken
    ? NAV_LINKS
    : role === "admin"
      ? ADMIN_LINKS
      : role === "teacher"
        ? [
            { href: "/dashboard", label: "ড্যাশবোর্ড" },
            { href: "/teacher/profile", label: "প্রোফাইল" },
            { href: "/teacher/courses", label: "কোর্স" },
          ]
        : [];

  if (links.length === 0) return null;

  if (mobile) {
    return (
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="মেনু খুলুন"
            render={
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full border-violet-200 bg-white text-violet-800"
              />
            }
          >
            <MenuIcon aria-hidden="true" className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {links.map((link) => {
              const hrefPath = link.href.split("#")[0];
              const isActive =
                hrefPath === "/dashboard"
                  ? pathname === "/dashboard" ||
                    pathname.startsWith("/admin/dashboard") ||
                    pathname.startsWith("/teacher/dashboard")
                  : Boolean(hrefPath && (pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)));

              return (
                <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
                  <span>{link.label}</span>
                  {isActive ? <span className="ml-auto text-xs text-violet-700">বর্তমান</span> : null}
                </DropdownMenuItem>
              );
            })}
            <NavbarMobileAccountItems />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <nav
      aria-label="প্রধান নেভিগেশন"
      className="hidden flex-1 items-center justify-center gap-3 text-xs text-muted-foreground sm:flex sm:gap-5 sm:text-sm"
    >
      {links.map((link) => {
        const hrefPath = link.href.split("#")[0];
        const isDashboardLink = hrefPath === "/dashboard";
        const isActive = isDashboardLink
          ? pathname === "/dashboard" ||
            pathname.startsWith("/admin/dashboard") ||
            pathname.startsWith("/teacher/dashboard")
          : Boolean(hrefPath && (pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)));

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-full bg-violet-100 px-3 py-1.5 font-semibold text-violet-800 underline-offset-4"
                : "rounded-full px-3 py-1.5 underline-offset-4 transition-colors hover:bg-violet-50 hover:text-foreground hover:underline"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
