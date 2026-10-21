"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil, Plus, RotateCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherCourseQuery } from "@/features/courses/queries";
import { cn } from "@/utils/utils";

export function TeacherCourseOverview({ courseId }: { courseId: string }) {
  const query = useTeacherCourseQuery(courseId);

  if (query.isPending) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6" role="status">
        কোর্স ও ব্যাচ লোড হচ্ছে…
      </main>
    );
  }

  if (query.isError || !query.data) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start gap-4 px-4 py-8 sm:px-6">
        <p role="alert" className="text-sm text-destructive">
          কোর্সের তথ্য আনা যায়নি। আবার চেষ্টা করুন।
        </p>
        <Button type="button" variant="outline" onClick={() => query.refetch()}>
          <RotateCw aria-hidden="true" data-icon="inline-start" /> আবার চেষ্টা
        </Button>
      </main>
    );
  }

  const { course, batches } = query.data;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href="/teacher/courses"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> আমার কোর্সে ফিরুন
      </Link>

      <Card className="gap-0">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-2">
              <span className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                {course.status === "published" ? "প্রকাশিত" : "খসড়া"}
              </span>
              <CardTitle className="text-xl sm:text-2xl">{course.title}</CardTitle>
            </div>
            <Link
              href={`/teacher/courses/${course.id}/edit`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
            >
              <Pencil aria-hidden="true" data-icon="inline-start" /> সম্পাদনা
            </Link>
          </div>
          <CardDescription className="max-w-3xl leading-6">
            {course.shortDescription || "কোর্স পরিচিতি যোগ করা হয়নি"}
          </CardDescription>
        </CardHeader>
        {course.fullSyllabus ? (
          <CardContent className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
            <span>সাধারণ পাঠ্যসূচি: {course.fullSyllabus}</span>
          </CardContent>
        ) : null}
      </Card>

      <section className="flex flex-col gap-4" aria-labelledby="course-batches-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="course-batches-heading" className="text-xl font-semibold tracking-tight">
              এই কোর্সের ব্যাচ
            </h2>
            <p className="text-sm text-muted-foreground">
              প্রতিটি ব্যাচের পাঠ্যসূচি ও পরীক্ষার সময়সূচি আলাদা করে সাজান।
            </p>
          </div>
          <Link href={`/teacher/courses/${course.id}/batches/new`} className={cn(buttonVariants(), "w-fit")}>
            <Plus aria-hidden="true" data-icon="inline-start" /> ব্যাচ তৈরি
          </Link>
        </div>

        {batches.length ? (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
            {batches.map((batch, index) => (
              <Link
                key={batch.id}
                href={`/teacher/courses/${course.id}/batches/${batch.id}`}
                className={cn(
                  "flex items-center gap-3 p-3 focus-visible:outline-2 focus-visible:outline-ring sm:p-4",
                  index ? "border-t" : "",
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary px-2 text-center text-xs font-medium text-secondary-foreground">
                  {batch.isDefault ? "ডিফল্ট" : batch.status === "upcoming" ? "আসছে" : batch.status}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{batch.title}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">{batch.description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              এখনো কোনো ব্যাচ নেই। প্রথম ব্যাচটি তৈরি করুন।
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
