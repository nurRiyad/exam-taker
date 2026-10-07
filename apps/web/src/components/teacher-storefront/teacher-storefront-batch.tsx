import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CalendarDays, FileText, GraduationCap, UsersRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ExamSchedule } from "@/components/exam-schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBatchExams, getCourseBatch, formatBanglaDate } from "@/lib/course-batches";
import { getCoursesByTeacher, getExamCategoryLabel, getPublicTeacher } from "@/lib/public-directory-data";
import { getStorefrontBrand } from "./brand";
import { getStorefrontBatchTitle, getStorefrontCourseCopy } from "./content";
import { TeacherPageMasthead } from "./teacher-page-masthead";
import { cn } from "@/lib/utils";

export function TeacherStorefrontBatch({ teacherSlug, batchId }: { teacherSlug: string; batchId: string }) {
  const teacher = getPublicTeacher(teacherSlug);
  if (!teacher) notFound();
  const course = getCoursesByTeacher(teacher.id).find((candidate) => getCourseBatch(candidate.id, batchId));
  const batch = course ? getCourseBatch(course.id, batchId) : undefined;
  if (!course || !batch) notFound();

  const exams = getBatchExams(batch);
  const nextExam = exams.find((exam) => !exam.isPast);
  const examHref = `/t/${teacherSlug}/batch/${batchId}/exam`;
  const brand = getStorefrontBrand(teacher.id);
  const courseCopy = getStorefrontCourseCopy(course);
  const batchStatus = batch.status === "শিগগিরই" ? "শিগগিরই শুরু" : batch.status === "শেষ" ? "শেষ হয়েছে" : "চলমান";

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
          href={`/t/${teacherSlug}/course/${course.id}`}
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {courseCopy.title}
        </Link>
        <Card className="gap-0 border-border/70 p-4 shadow-sm shadow-indigo-950/[0.025] sm:p-5">
          <CardHeader className="gap-3 p-0">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <h1
                title={getStorefrontBatchTitle(batch.title, course)}
                className="min-w-0 text-xl font-semibold tracking-tight sm:flex-1 sm:text-2xl"
              >
                {getStorefrontBatchTitle(batch.title, course)}
              </h1>
              <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {getExamCategoryLabel(course.examCategory)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  <BookOpen aria-hidden="true" className="size-3.5" />
                  {exams.length.toLocaleString("bn-BD")}টি পরীক্ষা
                </span>
              </div>
            </div>
            <CardDescription className="line-clamp-2 max-w-4xl text-sm leading-5">{batch.description}</CardDescription>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 pt-3 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <UsersRound aria-hidden="true" className="size-4" />
                {batch.studentCount.toLocaleString("bn-BD")} জন শিক্ষার্থী
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <GraduationCap aria-hidden="true" className="size-4" />
                {courseCopy.title}
              </span>
              <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                {batchStatus}
              </span>
              {nextExam ? (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays aria-hidden="true" className="size-4" />
                  পরবর্তী পরীক্ষা: {formatBanglaDate(nextExam.date)}
                </span>
              ) : (
                <span className="text-muted-foreground">সব পরীক্ষা শেষ</span>
              )}
            </div>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {formatBanglaDate(exams[0].date)} – {formatBanglaDate(exams[exams.length - 1].date)}
              </p>
              <Link
                href={`/t/${teacherSlug}/login?next=${encodeURIComponent(`/t/${teacherSlug}/batch/${batchId}`)}`}
                className={cn(buttonVariants({ size: "lg" }), "w-full shrink-0 sm:w-auto")}
              >
                এই ব্যাচে ভর্তি হোন
              </Link>
            </div>
          </CardHeader>
        </Card>
        <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
          <Card>
            <CardHeader>
              <CardTitle>এই ব্যাচের পরীক্ষাসূচি</CardTitle>
              <CardDescription>প্রতিটি পরীক্ষার তথ্য ও সিলেবাস আলাদাভাবে দেখুন।</CardDescription>
            </CardHeader>
            <CardContent>
              <ExamSchedule exams={exams} examHrefPrefix={examHref} />
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
    </div>
  );
}
