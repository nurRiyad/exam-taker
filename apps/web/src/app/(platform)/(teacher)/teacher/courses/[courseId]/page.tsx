import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BatchCard } from "@/components/batch-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBatches } from "@/lib/course-batches";
import { getPublicCourse } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

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
        <CardHeader className="gap-2">
          <span className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            {course.examCategory}
          </span>
          <CardTitle className="text-xl sm:text-2xl">{course.title}</CardTitle>
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {batches.map((batch) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                href={`/teacher/courses/${course.id}/batches/${batch.id}`}
                actionLabel="ব্যাচ পরিচালনা করুন"
              />
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
