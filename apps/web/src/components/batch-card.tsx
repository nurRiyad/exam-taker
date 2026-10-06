import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseBatch } from "@/lib/course-batches";
import { formatBanglaDate, getBatchExams } from "@/lib/course-batches";

type BatchCardProps = {
  batch: CourseBatch;
  href: string;
  actionLabel?: string;
};

export function BatchCard({ batch, href, actionLabel = "ব্যাচ দেখুন" }: BatchCardProps) {
  const exams = getBatchExams(batch);
  const startDate = exams[0]?.date;
  const endDate = exams.at(-1)?.date;

  return (
    <Link
      href={href}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full gap-0 transition-colors group-hover:bg-muted/20">
        <CardHeader className="gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              {batch.status}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
          <CardTitle className="text-base leading-6">{batch.title}</CardTitle>
          <CardDescription className="line-clamp-2 leading-5">{batch.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
            {startDate ? (
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                শুরু {formatBanglaDate(startDate)}
              </span>
            ) : null}
            {endDate ? (
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                শেষ {formatBanglaDate(endDate)}
              </span>
            ) : null}
          </div>
          <div className="border-t pt-3 text-sm font-medium text-primary group-hover:underline group-hover:underline-offset-4">
            {actionLabel}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
