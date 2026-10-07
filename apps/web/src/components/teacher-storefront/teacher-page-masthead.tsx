import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicTeacher } from "@/lib/public-directory-data";
import { getStorefrontBrand } from "./brand";

export function TeacherPageMasthead({
  teacher,
  showStudentLogin = true,
}: {
  teacher: PublicTeacher;
  showStudentLogin?: boolean;
}) {
  const brand = getStorefrontBrand(teacher.id);
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={`/t/${teacher.id}`}
          className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
            {brand.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{teacher.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{teacher.institution}</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {showStudentLogin ? (
            <Link
              href={`/t/${teacher.id}/login`}
              className="shrink-0 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
            >
              শিক্ষার্থী লগইন
            </Link>
          ) : null}
          <Link
            href={`/t/${teacher.id}#courses`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}
          >
            সব কোর্স
          </Link>
        </div>
      </div>
    </header>
  );
}
