import Link from "next/link";
import { ArrowRight, CalendarDays, UsersRound } from "lucide-react";

type DashboardBatch = {
  courseId: string;
  courseTitle: string;
  batchId: string;
  batchTitle: string;
  status: string;
  studentCount: number;
  nextExamDate: string;
  nextExamLabel: string;
  href: string;
};

export function TeacherDashboard({ batches }: { batches: DashboardBatch[] }) {
  if (!batches.length)
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        এখনো কোনো ব্যাচ তৈরি হয়নি। কোর্স থেকে প্রথম ব্যাচটি তৈরি করুন।
      </div>
    );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {batches.map((batch) => (
        <Link
          key={batch.batchId}
          href={batch.href}
          className="group rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/20 focus-visible:outline-2 focus-visible:outline-ring sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {batch.status}
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
          <h3 className="mt-3 line-clamp-1 font-semibold">{batch.batchTitle}</h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">{batch.courseTitle}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <UsersRound className="size-3.5" />
              {batch.studentCount.toLocaleString("bn-BD")} শিক্ষার্থী
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              পরীক্ষা {batch.nextExamLabel}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
