import Link from "next/link";
import { NavbarAccountAction } from "@/components/navbar-account-action";

const NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/teachers", label: "Teachers" },
] as const;

export function SiteNavbar() {
  return (
    <header className="border-b bg-background/95">
      <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center gap-3 px-3 py-2 sm:px-6">
        <Link
          href="/"
          className="min-w-0 shrink text-sm font-semibold tracking-tight underline-offset-4 hover:underline sm:text-base"
        >
          Exam Taker
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex flex-1 items-center justify-center gap-3 text-xs text-muted-foreground sm:gap-5 sm:text-sm"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="underline-offset-4 hover:text-foreground hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>

        <NavbarAccountAction />
      </div>
    </header>
  );
}
