import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBatchExams, getCourseBatch, formatBanglaDate } from "@/lib/course-batches";
import { getPublicCourse } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

export default async function StudentBatchPage({ params }: { params: Promise<{ courseId: string; batchId: string }> }) {
  const { courseId, batchId } = await params;
  const course = getPublicCourse(courseId);
  const batch = getCourseBatch(courseId, batchId);
  if (!course || !batch) notFound();
  const exams = getBatchExams(batch);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href="/student/courses"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        আমার কোর্স
      </Link>
      <header className="rounded-xl border bg-card p-5 sm:p-7">
        <p className="text-sm font-medium text-primary">{course.title}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{batch.title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{batch.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t pt-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4" />
            প্রতি {batch.examIntervalDays.toLocaleString("bn-BD")} দিন
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 aria-hidden="true" className="size-4" />
            {batch.examTime}
          </span>
        </div>
      </header>
      <div className="grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-start">
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">ব্যাচের পরীক্ষা</h2>
            <p className="text-sm text-muted-foreground">এই ব্যাচের সময়সূচি ও MCQ পরীক্ষা।</p>
          </div>
          {exams.map((exam) => (
            <Card key={exam.id} size="sm">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{exam.title}</CardTitle>
                  <CardDescription>
                    {formatBanglaDate(exam.date)} · {batch.examTime}
                  </CardDescription>
                </div>
                <Link
                  href={exam.isPast ? `/student/exams/${exam.id}/results` : `/student/exams/${exam.id}/attempt`}
                  className={cn(buttonVariants({ variant: exam.isPast ? "outline" : "default", size: "sm" }), "w-fit")}
                >
                  {exam.isPast ? "ফলাফল দেখুন" : "পরীক্ষা দিন"}
                </Link>
              </CardHeader>
            </Card>
          ))}
        </section>
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>সিলেবাস</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm">
                {batch.syllabus.map((topic) => (
                  <li key={topic} className="rounded-lg bg-muted/50 px-3 py-2">
                    {topic}
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
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
