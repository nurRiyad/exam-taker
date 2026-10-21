import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatBanglaDate, getBatchExams, getCourseBatches } from "@/utils/course-batches";
import type { PublicCourse, PublicTeacher } from "@/utils/public-directory-data";
import { getExamCategoryLabel } from "@/utils/public-directory-data";
import { getStorefrontBrand } from "./brand";
import { getStorefrontBatchTitle, getStorefrontCourseCopy } from "./content";
import { TeacherPageMasthead } from "./teacher-page-masthead";
import { TeacherPageFooter } from "./teacher-page-footer";

export function TeacherStorefrontCourse({ teacher, course }: { teacher: PublicTeacher; course: PublicCourse }) {
  const batches = getCourseBatches(course.id);
  const copy = getStorefrontCourseCopy(course);
  const brand = getStorefrontBrand(teacher.id);

  return (
    <div
      className="flex min-h-screen flex-col bg-background text-foreground"
      style={{ "--teacher-accent": brand.accent, "--teacher-accent-soft": brand.accentSoft } as React.CSSProperties}
    >
      <TeacherPageMasthead teacher={teacher} />
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring"
      >
        মূল কনটেন্টে যান
      </a>
      <main id="main-content" className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <Link
          href={`/t/${teacher.id}`}
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {teacher.name}-এর সব কোর্স
        </Link>
        <Card className="gap-0 border-border/70 p-0 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-2">
              <h1
                title={copy.title}
                className="min-w-0 flex-1 truncate whitespace-nowrap text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {copy.title}
              </h1>
              <span className="hidden shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground sm:inline-flex">
                {getExamCategoryLabel(course.examCategory)}
              </span>
              <span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                {copy.price}
              </span>
            </div>
            <p className="line-clamp-2 max-w-4xl text-sm leading-5 text-muted-foreground">{copy.description}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 pt-3 text-sm">
              <Link href={`/t/${teacher.id}`} className="font-medium underline-offset-4 hover:underline">
                শিক্ষক: {teacher.name}
              </Link>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <GraduationCap aria-hidden="true" className="size-4" />
                {course.examCount.toLocaleString("bn-BD")}টি পরীক্ষা
              </span>
              <span className="text-muted-foreground">{batches.length.toLocaleString("bn-BD")}টি ব্যাচ</span>
            </div>
          </CardContent>
        </Card>
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight">এই কোর্সের ব্যাচ</h2>
            <p className="text-sm text-muted-foreground">পছন্দের ব্যাচ বেছে নিয়ে সময়সূচি ও ভর্তি তথ্য দেখুন।</p>
          </div>
          {batches.length ? (
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm shadow-indigo-950/[0.025]">
              <ul className="divide-y divide-border/70">
                {batches.map((batch) => {
                  const exams = getBatchExams(batch);
                  const startDate = exams[0]?.date;
                  const endDate = exams.at(-1)?.date;
                  const statusTone =
                    batch.status === "চলমান"
                      ? "bg-emerald-50 text-emerald-700"
                      : batch.status === "শিগগিরই"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-muted text-muted-foreground";

                  return (
                    <li key={batch.id}>
                      <Link
                        href={`/t/${teacher.id}/batch/${batch.id}`}
                        className="group flex min-w-0 flex-col gap-3 p-4 transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:flex-row sm:items-center sm:gap-5 sm:px-5"
                      >
                        <span
                          aria-hidden="true"
                          className="hidden h-10 w-1 shrink-0 rounded-full bg-[var(--teacher-accent)]/70 sm:block"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="truncate font-semibold text-foreground">
                              {getStorefrontBatchTitle(batch.title, course)}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone}`}>
                              {batch.status}
                            </span>
                          </span>
                          <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                            {startDate ? (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays aria-hidden="true" className="size-3.5" /> শুরু{" "}
                                {formatBanglaDate(startDate)}
                              </span>
                            ) : null}
                            {endDate ? (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays aria-hidden="true" className="size-3.5" /> শেষ {formatBanglaDate(endDate)}
                              </span>
                            ) : null}
                          </span>
                        </span>
                        <span className="inline-flex items-center justify-end gap-1 text-sm font-medium text-primary sm:shrink-0">
                          ব্যাচ দেখুন
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-card px-5 py-10 text-center text-sm text-muted-foreground">
              এই কোর্সে এখনো কোনো ব্যাচ নেই।
            </div>
          )}
        </section>
      </main>
      <TeacherPageFooter teacher={teacher} />
    </div>
  );
}
