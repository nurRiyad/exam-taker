import Link from "next/link";
import { CalendarDays, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatBanglaDate } from "@/lib/course-batches";
import { getExamCategoryLabel } from "@/lib/public-directory-data";
import { getStorefrontCourseCopy } from "./content";
import type { StorefrontCourse } from "./types";

export function StorefrontCourseCard({ course, teacherSlug }: { course: StorefrontCourse; teacherSlug: string }) {
  const activeBatches = course.batches.filter((batch) => batch.status !== "শেষ");
  const firstBatch = activeBatches[0];
  const batchHref = `/t/${teacherSlug}/course/${course.id}`;
  const copy = getStorefrontCourseCopy(course);

  return (
    <Link
      href={batchHref}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={`${copy.title} — কোর্স ও ব্যাচ দেখুন`}
    >
      <Card className="h-full gap-3 border border-border/70 p-4 shadow-sm shadow-indigo-950/[0.025] transition-[transform,border-color,box-shadow] group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md group-hover:shadow-indigo-950/[0.06] group-focus-visible:border-primary/50 sm:p-5">
        <CardHeader className="gap-1.5 p-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">{getExamCategoryLabel(course.examCategory)}</p>
            <span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
              {copy.price}
            </span>
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-6 tracking-tight text-card-foreground sm:text-lg">
            {copy.title}
          </h3>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-0">
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">{copy.description}</p>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 pt-3 text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <GraduationCap aria-hidden="true" className="size-3.5" />
              {activeBatches.length.toLocaleString("bn-BD")} ব্যাচ
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {course.examCount.toLocaleString("bn-BD")} পরীক্ষা
            </span>
            {firstBatch ? (
              <span className="inline-flex items-center gap-1">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                শুরু {formatBanglaDate(new Date(`${firstBatch.firstExamDate}T12:00:00`))}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
