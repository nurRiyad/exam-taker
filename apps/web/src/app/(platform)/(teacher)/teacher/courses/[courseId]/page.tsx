import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Pencil, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBatches } from "@/utils/course-batches";
import { getPublicCourse } from "@/utils/public-directory-data";
import { cn } from "@/utils/utils";

type TeacherCoursePageProps = { params: Promise<{ courseId: string }> };

export default async function TeacherCoursePage({ params }: TeacherCoursePageProps) {
  const { courseId } = await params;
  const course = getPublicCourse(courseId);
  if (!course) notFound();
  const batches = getCourseBatches(course.id);

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
                {course.examCategory}
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
          <CardDescription className="max-w-3xl leading-6">{course.fullDescription}</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
          <span>শিক্ষক: {course.teacherName}</span>
          <span>সাধারণ পাঠ্যসূচি: {course.fullSyllabus}</span>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">এই কোর্সের ব্যাচ</h2>
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
              <div
                key={batch.id}
                className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 p-3 sm:gap-4 sm:p-4 ${index ? "border-t" : ""}`}
              >
                <Link
                  href={`/teacher/courses/${course.id}/batches/${batch.id}`}
                  className="group flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary px-2 text-center text-xs font-medium text-secondary-foreground">
                    {batch.status}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{batch.title}</span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">{batch.description}</span>
                  </span>
                </Link>
                <Link
                  href={`/teacher/courses/${course.id}/batches/${batch.id}/edit`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "shrink-0 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={`${batch.title} সম্পাদনা`}
                >
                  <Pencil data-icon="inline-start" /> সম্পাদনা
                </Link>
                <Link
                  href={`/teacher/courses/${course.id}/batches/${batch.id}`}
                  aria-label={`${batch.title} খুলুন`}
                  className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <ArrowRight className="size-4" />
                </Link>
              </div>
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
