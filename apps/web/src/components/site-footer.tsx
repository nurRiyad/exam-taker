import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/teachers", label: "Teachers" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign up" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p className="text-xs">This page is under heavy construction.</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Exam Taker. All rights reserved.</p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
