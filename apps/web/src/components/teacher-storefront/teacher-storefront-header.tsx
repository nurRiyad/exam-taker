import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import type { PublicTeacher } from "@/utils/public-directory-data";
import type { StorefrontBrand } from "./types";

export function TeacherStorefrontHeader({ teacher, brand }: { teacher: PublicTeacher; brand: StorefrontBrand }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 shadow-sm shadow-foreground/[0.02] backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={`/t/${teacher.id}`}
          className="flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--teacher-accent)]"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--teacher-accent-soft)] text-sm font-bold text-[var(--teacher-accent)]">
            {brand.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{teacher.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{teacher.institution}</span>
          </span>
        </Link>
        <nav
          aria-label="শিক্ষকের পেজ নেভিগেশন"
          className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex"
        >
          <Link
            href={`/t/${teacher.id}#courses`}
            className="rounded-sm hover:text-[var(--teacher-accent)] focus-visible:outline-2 focus-visible:outline-[var(--teacher-accent)]"
          >
            কোর্স ও ব্যাচ
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href={`/t/${teacher.id}/about`}
            className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
          >
            প্রোফাইল
          </Link>
          <Link
            href={`/t/${teacher.id}#courses`}
            className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
          >
            কোর্স
          </Link>
          <Link href={`/t/${teacher.id}/login`} className={cn(buttonVariants({ size: "sm" }), "h-9 px-4")}>
            শিক্ষার্থী লগইন
          </Link>
        </div>
      </div>
    </header>
  );
}
