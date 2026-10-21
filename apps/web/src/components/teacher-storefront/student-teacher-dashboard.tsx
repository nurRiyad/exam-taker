import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Check, Clock3, Target } from "lucide-react";
import { getCoursesByTeacher, type PublicCourse, type PublicTeacher } from "@/utils/public-directory-data";
import { getStorefrontBrand } from "./brand";

const upcomingExams = [
  {
    title: "সাধারণ বিজ্ঞান · মানবদেহ",
    course: "বিসিএস পূর্ণাঙ্গ প্রস্তুতি",
    date: "১০ অক্টোবর",
    time: "রাত ৮:০০",
    ready: true,
  },
  {
    title: "সাপ্তাহিক মডেল টেস্ট ০৭",
    course: "বিসিএস পূর্ণাঙ্গ প্রস্তুতি",
    date: "১২ অক্টোবর",
    time: "রাত ৮:০০",
    ready: true,
  },
  { title: "গণিত · শতকরা ও লাভ-ক্ষতি", course: "ব্যাংক জব গণিত", date: "১৪ অক্টোবর", time: "রাত ৯:০০", ready: false },
];

const courseSummaries = [
  { average: "৭৮%", attended: 8, missed: 1, rank: 8, students: 142, next: "১০ অক্টোবর" },
  { average: "৮৬%", attended: 6, missed: 0, rank: 14, students: 96, next: "১৪ অক্টোবর" },
  { average: "৬৯%", attended: 4, missed: 2, rank: 27, students: 118, next: "১৬ অক্টোবর" },
];

function localizedCourseTitle(course: PublicCourse) {
  const knownTitles: Record<string, string> = {
    "bcs-english-foundation": "ইংরেজি ফাউন্ডেশন",
    "math-shortcut-practice": "ব্যাংক জব গণিত",
    "bangladesh-affairs-mcq": "বাংলাদেশ বিষয়াবলি",
    "reasoning-masterclass": "যুক্তি ও বিশ্লেষণ",
  };
  return knownTitles[course.id] ?? course.title;
}

export function StudentTeacherDashboard({
  teacher,
  studentUsername,
}: {
  teacher: PublicTeacher;
  studentUsername: string;
}) {
  const brand = getStorefrontBrand(teacher.id);
  const courses = getCoursesByTeacher(teacher.id).slice(0, 3);

  return (
    <main
      className="min-h-screen bg-[#f7f8fc] text-foreground"
      style={{ "--teacher-accent": brand.accent, "--teacher-accent-soft": brand.accentSoft } as React.CSSProperties}
    >
      <header className="border-b border-border/80 bg-white">
        <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href={`/t/${teacher.id}`}
            className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-[var(--teacher-accent)]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--teacher-accent-soft)] text-sm font-bold text-[var(--teacher-accent)]">
              {brand.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{teacher.name}</span>
              <span className="block truncate text-xs text-muted-foreground">শিক্ষার্থী ড্যাশবোর্ড</span>
            </span>
          </Link>
          <Link
            href={`/t/${teacher.id}`}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            শিক্ষকের পেজ দেখুন
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-9">
        <section className="mb-7 rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-5 text-white shadow-lg shadow-indigo-900/10 sm:p-8">
          <p className="mb-2 text-sm font-medium text-indigo-100">
            @{studentUsername} <span className="px-1">·</span> {teacher.name}-এর কোর্স
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">আপনার পড়াশোনার সারসংক্ষেপ</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
            এই শিক্ষকের সঙ্গে যুক্ত সব কোর্সের অগ্রগতি এক নজরে দেখুন।
          </p>
        </section>

        <section className="mb-9" aria-label="শিক্ষকের সব কোর্সে সামগ্রিক অগ্রগতি">
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">সামগ্রিক অগ্রগতি</h2>
            <p className="mt-1 text-sm text-muted-foreground">{teacher.name}-এর আপনার সব কোর্স মিলিয়ে</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
            {[
              {
                label: "পরীক্ষায় অংশ নিয়েছেন",
                value: "১৮টি",
                detail: "৩টি কোর্স জুড়ে",
                icon: Check,
                color: "bg-emerald-50 text-emerald-700",
              },
              {
                label: "মিস করেছেন",
                value: "৩টি",
                detail: "অনুমোদিত কোর্সের পরীক্ষা",
                icon: CalendarDays,
                color: "bg-amber-50 text-amber-700",
              },
              {
                label: "উপস্থিতির হার",
                value: "৮৬%",
                detail: "যোগ্য পরীক্ষার ভিত্তিতে",
                icon: Target,
                color: "bg-blue-50 text-blue-700",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.label} className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
                  <span className={`mb-4 flex size-9 items-center justify-center rounded-xl ${stat.color}`}>
                    <Icon className="size-[18px]" />
                  </span>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-9">
          <div className="mb-4">
            <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">কোর্স অনুযায়ী</p>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">আপনার কোর্সগুলো</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {courses.map((course, index) => {
              const summary = courseSummaries[index % courseSummaries.length];
              const title = localizedCourseTitle(course);
              return (
                <Link
                  key={course.id}
                  href={`/t/${teacher.id}/s/${studentUsername}/course/${course.id}`}
                  className="group flex min-h-24 items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:border-[var(--teacher-accent)]/40 hover:bg-[var(--teacher-accent-soft)]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teacher-accent)] sm:p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--teacher-accent-soft)] text-[var(--teacher-accent)]">
                    <BookOpen className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-foreground">{title}</span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {course.examCategory} <span className="px-1">·</span> {course.level}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold text-foreground">{summary.average}</span>
                    <span className="block text-[11px] text-muted-foreground">গড় স্কোর</span>
                  </span>
                  <span className="ml-1 hidden shrink-0 rounded-full bg-[var(--teacher-accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--teacher-accent)] sm:inline-flex">
                    #{summary.rank}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--teacher-accent)]"
                  />
                </Link>
              );
            })}
          </div>
          {courses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <p className="font-semibold">এখনো কোনো কোর্সে যুক্ত হননি</p>
              <p className="mt-1 text-sm text-muted-foreground">শিক্ষকের পেজ থেকে একটি কোর্স বেছে নিন।</p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--teacher-accent)]"
                href={`/t/${teacher.id}`}
              >
                কোর্স দেখুন
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">সব কোর্স মিলিয়ে</p>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">পরের ৩টি পরীক্ষা</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {upcomingExams.map((exam) => (
              <article
                key={exam.title}
                className="flex gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm"
              >
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--teacher-accent-soft)] text-[var(--teacher-accent)]">
                  <span className="text-xs font-medium">অক্টো</span>
                  <span className="text-lg font-bold leading-5">{exam.date.split(" ")[0]}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold leading-5">{exam.title}</h3>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{exam.course}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      {exam.time}
                    </span>
                    <span className={exam.ready ? "font-medium text-emerald-700" : "text-amber-700"}>
                      {exam.ready ? "প্রস্তুত" : "অনুমোদনের অপেক্ষায়"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Link
            href={`/t/${teacher.id}`}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[var(--teacher-accent)] hover:bg-muted"
          >
            সম্পূর্ণ সময়সূচি
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
