import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/courses", label: "কোর্স" },
  { href: "/teachers", label: "শিক্ষক" },
  { href: "/login", label: "লগইন" },
  { href: "/signup", label: "অ্যাকাউন্ট খুলুন" },
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p className="text-xs">ওয়েবসাইট তৈরির কাজ চলমান আছে।</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© ২০২৬ এক্সাম টেকার। সর্বস্বত্ব সংরক্ষিত।</p>
          <nav aria-label="ফুটার নেভিগেশন" className="flex flex-wrap gap-x-4 gap-y-2">
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
