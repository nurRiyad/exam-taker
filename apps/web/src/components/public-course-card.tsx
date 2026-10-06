import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCourseBatches } from "@/lib/course-batches";
import { getExamCategoryLabel, type PublicCourse } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

export function PublicCourseCard({ course, locale = "en" }: { course: PublicCourse; locale?: "en" | "bn" }) {
  const batchCount = getCourseBatches(course.id).length;
  const examCategory = locale === "bn" ? getExamCategoryLabel(course.examCategory) : course.examCategory;
  const batchLabel = locale === "bn" ? "ব্যাচ" : "batches";
  const examLabel = locale === "bn" ? "পরীক্ষা" : "exams";
  const detailsLabel = locale === "bn" ? "বিস্তারিত" : "Details";
  const teacherLabel = locale === "bn" ? "শিক্ষক" : "Teacher";

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={locale === "bn" ? `${course.title} — বিস্তারিত দেখুন` : `${course.title} — View details`}
    >
      <Card className="h-full gap-3 border border-border/70 p-4 shadow-sm shadow-indigo-950/[0.025] transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md group-hover:shadow-indigo-950/[0.06] group-focus-visible:border-primary/50 sm:p-5">
        <CardHeader className="gap-1.5 p-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted-foreground">{examCategory}</p>
            <span className="shrink-0 rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-sky-100">
              {course.priceLabel}
            </span>
          </div>
          <div
            style={locale === "bn" ? { fontFamily: "inherit" } : undefined}
            className={cn(
              "line-clamp-2 text-base font-semibold leading-6 tracking-tight sm:text-lg",
              locale === "bn" && "font-sans text-[1.125rem] leading-7 tracking-tight",
            )}
          >
            {course.title}
          </div>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            <span>{teacherLabel}</span> <span className="font-medium text-foreground">{course.teacherName}</span>
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 p-0">
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">{course.description}</p>
          <div className="flex min-w-0 items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs sm:text-sm">
            <span className="min-w-0 truncate text-muted-foreground">
              {batchCount.toLocaleString(locale === "bn" ? "bn-BD" : "en")} {batchLabel}{" "}
              <span aria-hidden="true">·</span> {course.examCount.toLocaleString(locale === "bn" ? "bn-BD" : "en")}{" "}
              {examLabel}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 font-medium text-primary">
              {detailsLabel}{" "}
              <ArrowUpRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
