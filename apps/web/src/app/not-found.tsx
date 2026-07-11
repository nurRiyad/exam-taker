import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-13rem)] w-full max-w-3xl flex-col justify-center gap-5 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          The page you are looking for is not available yet, or the address may have changed.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href="/" className={cn(buttonVariants(), "w-full sm:w-auto")}>
          Go home
        </Link>
        <Link href="/courses" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
          Browse courses
        </Link>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto")}>
          Dashboard
        </Link>
      </div>
    </main>
  );
}