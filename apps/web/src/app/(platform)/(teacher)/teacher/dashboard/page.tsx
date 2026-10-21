import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, ClipboardCheck, Plus, UsersRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { getBatchExams, getCourseBatches, getTeacherCourses, formatBanglaDate } from "@/lib/course-batches";
import { cn } from "@/lib/utils";

const TEACHER_ID = "mahbub-hasan";
const demoAttention = [
  {
    title: "ভর্তি অনুরোধ পর্যালোচনা",
    description: "৭ জন শিক্ষার্থীর কোর্স অ্যাক্সেস অপেক্ষমাণ",
    href: "/teacher/billing",
    action: "অনুরোধ দেখুন",
    icon: UsersRound,
    tone: "amber" as const,
  },
  {
    title: "পরীক্ষার প্রশ্ন প্রস্তুত করুন",
    description: "২টি আসন্ন পরীক্ষায় প্রশ্ন যোগ করা বাকি",
    href: "/teacher/courses",
    action: "পরীক্ষা দেখুন",
    icon: ClipboardCheck,
    tone: "blue" as const,
  },
];

export default function TeacherDashboardPage() {
  const courses = getTeacherCourses(TEACHER_ID);
  const batches = courses.flatMap((course) => getCourseBatches(course.id).map((batch) => ({ course, batch })));
  const studentTotal = batches.reduce((total, item) => total + item.batch.studentCount, 0);
  const exams = batches.flatMap(({ course, batch }) =>
    getBatchExams(batch)
      .filter((exam) => !exam.isPast)
      .map((exam) => ({
        id: exam.id,
        title: exam.title,
        courseTitle: course.title,
        batchTitle: batch.title,
        dateKey: exam.date.toISOString(),
        dateLabel: formatBanglaDate(exam.date),
        time: batch.examTime,
        href: `/teacher/courses/${course.id}/batches/${batch.id}`,
      })),
  );
  const upcomingExams = exams.sort((a, b) => a.dateKey.localeCompare(b.dateKey)).slice(0, 4);
  const batchDirectoryEntries = batches.map(({ course, batch }) => {
    const nextExam = getBatchExams(batch).find((exam) => !exam.isPast);
    return {
      courseId: course.id,
      courseTitle: course.title,
      batchId: batch.id,
      batchTitle: batch.title,
      status: batch.status,
      studentCount: batch.studentCount,
      nextExamDate: nextExam?.date.toISOString() ?? "",
      nextExamLabel: nextExam ? formatBanglaDate(nextExam.date) : "পরীক্ষা নির্ধারিত নয়",
      href: `/teacher/courses/${course.id}/batches/${batch.id}`,
    };
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-7 sm:px-6 sm:py-9">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">শিক্ষক ওভারভিউ</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">ড্যাশবোর্ড</h1>
          <p className="mt-1 text-sm text-muted-foreground">আপনার কোর্স, ব্যাচ ও আসন্ন কাজের সংক্ষিপ্ত চিত্র।</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/teacher/courses/new" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
            <Plus />
            কোর্স তৈরি
          </Link>
          <Link href="/teacher/courses" className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>
            <Plus />
            ব্যাচ তৈরি
          </Link>
          <Link href="/teacher/courses" className={cn(buttonVariants(), "gap-2")}>
            <Plus />
            পরীক্ষা তৈরি
          </Link>
        </div>
      </header>

      <section aria-label="শিক্ষক অ্যাকাউন্টের সারসংক্ষেপ" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "চলমান কোর্স",
            value: courses.length,
            caption: "আপনার কোর্স",
            icon: BookOpen,
            tint: "bg-violet-50 text-violet-700",
          },
          {
            label: "মোট ব্যাচ",
            value: batches.length,
            caption: "সব কোর্স মিলিয়ে",
            icon: ClipboardCheck,
            tint: "bg-blue-50 text-blue-700",
          },
          {
            label: "ব্যাচে শিক্ষার্থী",
            value: studentTotal,
            caption: "ব্যাচভিত্তিক মোট",
            icon: UsersRound,
            tint: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "আসন্ন পরীক্ষা",
            value: exams.length,
            caption: "চলমান ব্যাচগুলোতে",
            icon: CalendarDays,
            tint: "bg-amber-50 text-amber-700",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
              <span className={cn("mb-3 flex size-9 items-center justify-center rounded-xl", stat.tint)}>
                <Icon className="size-[18px]" />
              </span>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{stat.value.toLocaleString("bn-BD")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.caption}</p>
            </article>
          );
        })}
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">যা করা বাকি</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">আপনার নজর দরকার</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {demoAttention.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5"
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    item.tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex min-h-8 items-center gap-1 text-sm font-semibold text-primary"
                  >
                    {item.action}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">সময়সূচি</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">আসন্ন পরীক্ষা</h2>
            </div>
            <Link href="/teacher/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              সব কোর্স
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            {upcomingExams.map((exam, index) => (
              <Link
                key={exam.id}
                href={exam.href}
                className={cn(
                  "flex items-center gap-3 p-4 transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring",
                  index > 0 && "border-t border-border/80",
                )}
              >
                <span className="flex size-10 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <CalendarDays className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{exam.title}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {exam.courseTitle} · {exam.batchTitle}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-xs font-semibold">{exam.dateLabel}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">{exam.time}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">কোর্সভিত্তিক</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">আপনার কোর্স</h2>
            </div>
            <Link href="/teacher/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              সবগুলো
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {courses.slice(0, 5).map((course) => {
              const courseBatches = getCourseBatches(course.id);
              const count = courseBatches.reduce((sum, batch) => sum + batch.studentCount, 0);
              return (
                <Link
                  key={course.id}
                  href={`/teacher/courses/${course.id}`}
                  className="group flex min-h-16 items-center gap-3 rounded-xl border border-border/80 bg-card px-4 py-3 transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <BookOpen className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{course.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {courseBatches.length.toLocaleString("bn-BD")} ব্যাচ · {count.toLocaleString("bn-BD")} শিক্ষার্থী
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">ব্যাচভিত্তিক</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">শিগগির পরীক্ষা আছে</h2>
            <p className="mt-1 text-sm text-muted-foreground">পরবর্তী পরীক্ষার তারিখ অনুযায়ী ব্যাচ সাজানো।</p>
          </div>
          <Link
            href="/teacher/batches"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
          >
            সব ব্যাচ
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <TeacherDashboard
          batches={batchDirectoryEntries
            .slice()
            .sort((a, b) => a.nextExamDate.localeCompare(b.nextExamDate))
            .slice(0, 4)}
        />
      </section>
    </main>
  );
}
