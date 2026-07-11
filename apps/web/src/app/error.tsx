"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[calc(100dvh-13rem)] w-full max-w-3xl flex-col justify-center gap-5 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Error</p>
        <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          We could not load this page correctly. Try again, or return home and continue from there.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={() => reset()} className="w-full sm:w-auto">
          Try again
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
          Go home
        </Link>
      </div>
    </main>
  );
}
