import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ClipboardList, Pencil, Plus, UsersRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBatchExams, getCourseBatch, formatBanglaDate } from "@/utils/course-batches";
import { getPublicCourse } from "@/utils/public-directory-data";
import { cn } from "@/utils/utils";

export default async function TeacherBatchPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  const course = getPublicCourse(courseId);
  const batch = getCourseBatch(courseId, batchId);
  if (!course || !batch) notFound();
  const exams = getBatchExams(batch);
  const upcomingExams = exams.filter((exam) => !exam.isPast);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href={`/teacher/courses/${courseId}`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {course.title} · ব্যাচসমূহ
      </Link>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              {batch.status} · {course.examCategory}
            </span>
            <CardTitle className="text-xl sm:text-2xl">{batch.title}</CardTitle>
            <CardDescription className="max-w-3xl leading-6">{batch.description}</CardDescription>
          </div>
          <Link
            href={`/teacher/courses/${courseId}/batches/${batchId}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
          >
            <Pencil aria-hidden="true" data-icon="inline-start" /> ব্যাচ সম্পাদনা
          </Link>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <UsersRound aria-hidden="true" className="size-4" />
            {batch.studentCount.toLocaleString("bn-BD")} জন শিক্ষার্থী
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-4" />
            প্রতি {batch.examIntervalDays.toLocaleString("bn-BD")} দিনে · {batch.examTime}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClipboardList aria-hidden="true" className="size-4" />
            পরবর্তী পরীক্ষা {formatBanglaDate(upcomingExams[0]?.date ?? exams[0].date)}
          </span>
        </CardContent>
      </Card>

      <section aria-labelledby="batch-exams-heading" className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 id="batch-exams-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              পরীক্ষার তালিকা
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">পরীক্ষার তথ্য সম্পাদনা করুন বা নতুন পরীক্ষা যোগ করুন।</p>
          </div>
          <Link
            href={`/teacher/courses/${courseId}/batches/${batchId}/exams/new`}
            className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
          >
            <Plus aria-hidden="true" data-icon="inline-start" /> পরীক্ষা যোগ
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          {exams.map((exam, index) => (
            <div
              key={exam.id}
              className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 p-3 sm:gap-4 sm:p-4 ${index ? "border-t" : ""}`}
            >
              <Link
                href={`/teacher/courses/${courseId}/batches/${batchId}/exams/${exam.id}/questions`}
                className="group min-w-0 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="block truncate font-semibold group-hover:text-primary">{exam.title}</span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {formatBanglaDate(exam.date)} · {batch.examTime} · {exam.questionCount.toLocaleString("bn-BD")} প্রশ্ন
                  · {exam.durationMinutes.toLocaleString("bn-BD")} মিনিট
                </span>
              </Link>
              <Link
                href={`/teacher/courses/${courseId}/batches/${batchId}/exams/${exam.id}`}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0")}
              >
                <Pencil aria-hidden="true" data-icon="inline-start" /> সম্পাদনা
              </Link>
              <Link
                href={`/teacher/courses/${courseId}/batches/${batchId}/exams/${exam.id}/questions`}
                aria-label={`${exam.title} এর MCQ প্রশ্ন খুলুন`}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
