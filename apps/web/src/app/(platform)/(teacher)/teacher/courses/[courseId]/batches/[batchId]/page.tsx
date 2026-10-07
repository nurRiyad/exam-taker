import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ClipboardList, Pencil, Plus, UsersRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBatchExams, getCourseBatch, formatBanglaDate } from "@/lib/course-batches";
import { getPublicCourse } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            {batch.status} · {course.examCategory}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{batch.title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{batch.description}</p>
        </div>
        <Link
          href={`/teacher/courses/${courseId}/batches/${batchId}/edit`}
          className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
        >
          <Pencil aria-hidden="true" data-icon="inline-start" /> ব্যাচ সম্পাদনা
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>শিক্ষার্থী</CardDescription>
              <CardTitle>{batch.studentCount.toLocaleString("bn-BD")} জন</CardTitle>
            </div>
            <UsersRound aria-hidden="true" className="size-5 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>পরীক্ষার ব্যবধান</CardDescription>
              <CardTitle>{batch.examIntervalDays.toLocaleString("bn-BD")} দিন</CardTitle>
            </div>
            <CalendarDays aria-hidden="true" className="size-5 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>পরবর্তী পরীক্ষা</CardDescription>
              <CardTitle className="text-base">{formatBanglaDate(upcomingExams[0]?.date ?? exams[0].date)}</CardTitle>
            </div>
            <ClipboardList aria-hidden="true" className="size-5 text-muted-foreground" />
          </CardHeader>
        </Card>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">এই ব্যাচের পরীক্ষা</h2>
              <p className="text-sm text-muted-foreground">
                স্বয়ংক্রিয় সময়সূচি থেকে তৈরি হয়েছে; প্রতিটি পরীক্ষার তারিখ আলাদা করে বদলাতে পারবেন।
              </p>
            </div>
            <Link
              href={`/teacher/courses/${courseId}/batches/${batchId}/exams`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
            >
              সব পরীক্ষা
            </Link>
          </div>
          {upcomingExams.slice(0, 3).map((exam) => (
            <Card key={exam.id} size="sm">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{exam.title}</CardTitle>
                  <CardDescription>
                    {formatBanglaDate(exam.date)} · {batch.examTime}
                  </CardDescription>
                </div>
                <Link
                  href={`/teacher/courses/${courseId}/batches/${batchId}/exams/${exam.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
                >
                  পরীক্ষা সম্পাদনা
                </Link>
              </CardHeader>
            </Card>
          ))}
        </section>
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>ব্যাচের পাঠ্যসূচি</CardTitle>
              <CardDescription>এই ব্যাচের জন্য আলাদা করে নির্ধারিত</CardDescription>
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
                {batch.materials.map((material) => (
                  <li key={material}>{material}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Link
            href={`/teacher/courses/${courseId}/batches/${batchId}/exams/new`}
            className={cn(buttonVariants(), "w-full")}
          >
            <Plus aria-hidden="true" data-icon="inline-start" /> পরীক্ষা যোগ করুন
          </Link>
        </aside>
      </div>
    </main>
  );
}
