import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { BatchCard } from "@/components/batch-card";
import { Card, CardContent } from "@/components/ui/card";
import { getCourseBatches } from "@/lib/course-batches";
import type { PublicCourse, PublicTeacher } from "@/lib/public-directory-data";
import { getExamCategoryLabel } from "@/lib/public-directory-data";
import { getStorefrontBrand } from "./brand";
import { getStorefrontBatchTitle, getStorefrontCourseCopy } from "./content";
import { TeacherPageMasthead } from "./teacher-page-masthead";

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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {batches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={{ ...batch, title: getStorefrontBatchTitle(batch.title, course) }}
                  href={`/t/${teacher.id}/batch/${batch.id}`}
                  showAction={false}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-card px-5 py-10 text-center text-sm text-muted-foreground">
              এই কোর্সে এখনো কোনো ব্যাচ নেই।
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
