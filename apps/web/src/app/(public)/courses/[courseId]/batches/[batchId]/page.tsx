import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, UsersRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamSchedule } from "@/components/exam-schedule";
import { getBatchExams, getCourseBatch, formatBanglaDate } from "@/lib/course-batches";
import { getPublicCourse } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

export default async function PublicBatchPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  const course = getPublicCourse(courseId);
  const batch = getCourseBatch(courseId, batchId);
  if (!course || !batch) notFound();
  const exams = getBatchExams(batch);
  const batchStatus = batch.status === "শিগগিরই" ? "শিগগিরই শুরু" : batch.status === "শেষ" ? "শেষ হয়েছে" : "চলমান";
  const startDate = exams[0].date;
  const endDate = exams[exams.length - 1].date;
  const nextExam = exams.find((exam) => !exam.isPast);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href={`/courses/${course.id}`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {course.title}
      </Link>
      <section className="rounded-xl border bg-card p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="truncate text-sm font-medium text-primary">
              {course.title} · {course.examCategory}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{batch.title}</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{batch.description}</p>
          </div>
          <Link
            href={`/login?next=${encodeURIComponent(`/student/courses/${course.id}/join?batchId=${batch.id}`)}`}
            className={cn(buttonVariants({ size: "lg" }), "w-full shrink-0 sm:w-auto")}
          >
            এই ব্যাচে ভর্তি হোন
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1 rounded-lg bg-muted/40 p-3">
            <span className="text-xs text-muted-foreground">মোট শিক্ষার্থী</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <UsersRound aria-hidden="true" className="size-4 text-muted-foreground" />
              {batch.studentCount.toLocaleString("bn-BD")} জন
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-muted/40 p-3">
            <span className="text-xs text-muted-foreground">শুরুর তারিখ</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" />
              {formatBanglaDate(startDate)}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-muted/40 p-3">
            <span className="text-xs text-muted-foreground">শেষের তারিখ</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" />
              {formatBanglaDate(endDate)}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-muted/40 p-3">
            <span className="text-xs text-muted-foreground">কোর্স ফি</span>
            <span className="text-sm font-semibold">{course.priceLabel}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="rounded-md bg-secondary px-2 py-1 font-medium text-secondary-foreground">
            অবস্থা: {batchStatus}
          </span>
          {nextExam ? (
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4" />
              পরবর্তী পরীক্ষা: {formatBanglaDate(nextExam.date)}
            </span>
          ) : (
            <span>সব পরীক্ষা শেষ</span>
          )}
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>এই ব্যাচের পরীক্ষাসূচি</CardTitle>
            <CardDescription>প্রতিটি পরীক্ষার তথ্য ও সিলেবাস আলাদাভাবে দেখুন।</CardDescription>
          </CardHeader>
          <CardContent>
            <ExamSchedule exams={exams} />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>সম্পূর্ণ ব্যাচের সিলেবাস</CardTitle>
              <CardDescription>ব্যাচের সব পরীক্ষায় পড়ানো বিষয়সমূহ।</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm">
                {batch.syllabus.map((item) => (
                  <li key={item} className="rounded-lg bg-muted/50 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>শেখার উপকরণ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {batch.materials.map((item) => (
                  <li key={item} className="inline-flex items-start gap-2">
                    <FileText aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
