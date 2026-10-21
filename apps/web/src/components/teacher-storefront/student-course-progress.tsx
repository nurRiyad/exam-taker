import Link from "next/link";
import { ArrowLeft, Check, Medal, Target } from "lucide-react";
import type { PublicCourse, PublicTeacher } from "@/lib/public-directory-data";
import { getStorefrontBrand } from "./brand";
import { cn } from "@/lib/utils";

const results = [
  { name: "কোর্স মডেল টেস্ট ০৬", date: "৫ অক্টোবর", score: 42, total: 50, rank: 12, participants: 142 },
  { name: "অধ্যায়ভিত্তিক পরীক্ষা ০৫", date: "২ অক্টোবর", score: 38, total: 50, rank: 21, participants: 138 },
  { name: "কোর্স মডেল টেস্ট ০৫", date: "২৮ সেপ্টেম্বর", score: 44, total: 50, rank: 8, participants: 139 },
  { name: "অনুশীলনী পরীক্ষা ০৪", date: "২৪ সেপ্টেম্বর", score: 35, total: 50, rank: 34, participants: 135 },
  { name: "কোর্স মডেল টেস্ট ০৪", date: "২০ সেপ্টেম্বর", score: 40, total: 50, rank: 17, participants: 137 },
];

const accuracy = [
  { subject: "ইংরেজি", correct: 42, total: 50, percent: 84 },
  { subject: "গণিত", correct: 34, total: 50, percent: 68 },
  { subject: "বাংলাদেশ বিষয়াবলি", correct: 31, total: 50, percent: 62 },
  { subject: "সাধারণ বিজ্ঞান", correct: 24, total: 50, percent: 48 },
];

export function StudentCourseProgress({
  teacher,
  course,
  studentUsername,
}: {
  teacher: PublicTeacher;
  course: PublicCourse;
  studentUsername: string;
}) {
  const brand = getStorefrontBrand(teacher.id);
  const titleMap: Record<string, string> = {
    "bcs-english-foundation": "ইংরেজি ফাউন্ডেশন",
    "math-shortcut-practice": "ব্যাংক জব গণিত",
    "bangladesh-affairs-mcq": "বাংলাদেশ বিষয়াবলি",
    "reasoning-masterclass": "যুক্তি ও বিশ্লেষণ",
  };
  const title = titleMap[course.id] ?? course.title;
  const nextExamDate = new Date("2026-10-10T20:00:00+06:00");
  const dayNumber = (date: Date) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value);
    return Date.UTC(part("year"), part("month") - 1, part("day")) / 86_400_000;
  };
  const daysRemaining = Math.max(0, dayNumber(nextExamDate) - dayNumber(new Date()));
  const nextExamDateLabel = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(nextExamDate);
  return (
    <main
      className="min-h-screen bg-[#f7f8fc] text-foreground"
      style={{ "--teacher-accent": brand.accent, "--teacher-accent-soft": brand.accentSoft } as React.CSSProperties}
    >
      <header className="border-b border-border/80 bg-white">
        <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href={`/t/${teacher.id}/s/${studentUsername}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg pr-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--teacher-accent)]"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">ড্যাশবোর্ডে ফিরুন</span>
            <span className="sm:hidden">ফিরুন</span>
          </Link>
          <span className="truncate text-sm font-bold">{teacher.name}</span>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-9">
        <section className="mb-5 rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-5 text-white shadow-lg shadow-indigo-900/10 sm:p-7">
          <p className="mb-2 text-sm font-medium text-indigo-100">
            @{studentUsername} <span className="px-1">·</span> কোর্সের অগ্রগতি
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-indigo-100">
            {teacher.name} <span className="px-1">·</span> {course.examCategory} প্রস্তুতি
          </p>
        </section>

        <section
          className="mb-8 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
          aria-label="কোর্সের সারসংক্ষেপ"
        >
          <div className="grid grid-cols-2 divide-x divide-y divide-border/80 sm:grid-cols-3 xl:grid-cols-5 xl:divide-y-0">
            <article className="col-span-2 flex min-h-[76px] items-center gap-2.5 px-2.5 py-3 sm:px-4 xl:col-span-1">
              <span className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:flex">
                <Check className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">পরীক্ষার উপস্থিতি</p>
                <p className="mt-0.5 whitespace-nowrap text-sm font-bold sm:text-base">৮টি দিয়েছেন</p>
                <p className="text-[11px] text-muted-foreground">১টি মিস</p>
              </div>
            </article>
            <article className="flex min-h-[76px] items-center gap-2.5 px-2.5 py-3 sm:px-4">
              <span className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 sm:flex">
                <Target className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">গড় স্কোর</p>
                <p className="mt-0.5 text-sm font-bold sm:text-base">৭৮%</p>
              </div>
            </article>
            <article className="flex min-h-[76px] items-center gap-2.5 px-2.5 py-3 sm:px-4">
              <span className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 sm:flex">
                <Medal className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">কোর্স র‍্যাঙ্ক</p>
                <p className="mt-0.5 whitespace-nowrap text-sm font-bold sm:text-base">
                  #৮ <span className="text-xs font-medium text-muted-foreground">/১৪২</span>
                </p>
              </div>
            </article>
            <article className="col-span-2 flex min-h-[76px] items-center px-2.5 py-3 sm:col-span-1 sm:px-4">
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">পরের পরীক্ষা</p>
                <p className="mt-0.5 whitespace-nowrap text-xs font-bold sm:text-sm">পরীক্ষা ০৭</p>
                <p className="whitespace-nowrap text-[11px] text-muted-foreground">
                  {nextExamDateLabel} <span className="px-0.5">·</span>{" "}
                  {daysRemaining === 0 ? "আজ" : `${daysRemaining.toLocaleString("bn-BD")} দিন বাকি`}
                </p>
              </div>
            </article>
            <article className="col-span-2 flex min-h-[76px] items-center px-2.5 py-3 sm:col-span-1 sm:px-4">
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">ব্যক্তিগত সেরা</p>
                <p className="mt-0.5 whitespace-nowrap text-xs font-bold sm:text-sm">সর্বোচ্চ ৪৬/৫০</p>
                <p className="whitespace-nowrap text-[11px] text-muted-foreground">সর্বনিম্ন ২৮/৫০</p>
              </div>
            </article>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
          <section>
            <div className="mb-4">
              <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">পরীক্ষা অনুযায়ী</p>
              <h2 className="text-lg font-bold tracking-tight sm:text-xl">সাম্প্রতিক ফলাফল</h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="divide-y divide-border/80">
                {results.map((result) => (
                  <article key={result.name} className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">{result.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{result.date}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 sm:gap-7">
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {result.score}
                          <span className="text-muted-foreground">/{result.total}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">স্কোর</p>
                      </div>
                      <div className="min-w-12 text-right">
                        <p className="text-sm font-bold text-[var(--teacher-accent)]">#{result.rank}</p>
                        <p className="text-[11px] text-muted-foreground">/{result.participants} জন</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-8">
            <section>
              <div className="mb-4">
                <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground">শক্তি ও উন্নতির জায়গা</p>
                <h2 className="text-lg font-bold tracking-tight">বিষয়ভিত্তিক নির্ভুলতা</h2>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-950">
                  <Target className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <span>
                    এই কোর্সে <strong>সাধারণ বিজ্ঞান</strong> বিষয়ে আরও অনুশীলন করলে ফল ভালো হবে।
                  </span>
                </div>
                <div className="space-y-4">
                  {accuracy.map((item) => (
                    <div key={item.subject}>
                      <div className="mb-1.5 flex justify-between gap-2 text-sm">
                        <span className="font-medium">{item.subject}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {item.correct}/{item.total} <strong className="ml-1 text-foreground">{item.percent}%</strong>
                        </span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-muted"
                        role="meter"
                        aria-label={`${item.subject} নির্ভুলতা`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={item.percent}
                      >
                        <div
                          className={cn(
                            "h-full rounded-full",
                            item.percent >= 80 ? "bg-emerald-500" : item.percent >= 60 ? "bg-blue-500" : "bg-amber-500",
                          )}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                  সাম্প্রতিক লাইভ পরীক্ষার প্রশ্নের ভিত্তিতে
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
