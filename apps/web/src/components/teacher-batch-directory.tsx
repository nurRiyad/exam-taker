"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Search, UsersRound } from "lucide-react";
import { Input } from "@/components/ui/input";

type BatchEntry = {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  status: string;
  studentCount: number;
  nextExamDate: string;
  nextExamLabel: string;
  href: string;
};
type CourseOption = { id: string; title: string };

export function TeacherBatchDirectory({ batches, courses }: { batches: BatchEntry[]; courses: CourseOption[] }) {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const visibleBatches = useMemo(
    () =>
      batches
        .filter((batch) => courseFilter === "all" || batch.courseId === courseFilter)
        .filter((batch) => statusFilter === "all" || batch.status === statusFilter)
        .filter((batch) =>
          `${batch.title} ${batch.courseTitle}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
        )
        .sort((a, b) => (a.nextExamDate || "9999").localeCompare(b.nextExamDate || "9999")),
    [batches, courseFilter, query, statusFilter],
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-7 sm:px-6 sm:py-9">
      <header>
        <p className="text-sm font-medium text-primary">শিক্ষক ড্যাশবোর্ড</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">আমার ব্যাচ</h1>
        <p className="mt-1 text-sm text-muted-foreground">কোর্স ও পরবর্তী পরীক্ষার তারিখ অনুযায়ী সব ব্যাচ দেখুন।</p>
      </header>
      <section
        className="grid gap-3 rounded-2xl border border-border/80 bg-card p-3 sm:grid-cols-[minmax(0,1fr)_13rem_11rem] sm:p-4"
        aria-label="ব্যাচ খুঁজুন ও ফিল্টার করুন"
      >
        <label className="relative">
          <span className="sr-only">ব্যাচ বা কোর্স খুঁজুন</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ব্যাচ বা কোর্স খুঁজুন"
            className="pl-9"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          কোর্স
          <select
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
          >
            <option value="all">সব কোর্স</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          অবস্থা
          <select
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">সব অবস্থা</option>
            <option value="চলমান">চলমান</option>
            <option value="শিগগিরই">শিগগিরই</option>
            <option value="শেষ">শেষ</option>
          </select>
        </label>
      </section>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{visibleBatches.length.toLocaleString("bn-BD")}টি ব্যাচ</span>
        <span>পরীক্ষার তারিখ: আগে থেকে পরে</span>
      </div>
      {visibleBatches.length ? (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="ব্যাচের তালিকা">
          {visibleBatches.map((batch) => (
            <Link
              key={batch.id}
              href={batch.href}
              className="group rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/20 focus-visible:outline-2 focus-visible:outline-ring sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  {batch.status}
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <h2 className="mt-3 line-clamp-1 font-semibold">{batch.title}</h2>
              <p className="mt-1 truncate text-xs text-muted-foreground">{batch.courseTitle}</p>
              <div className="mt-4 flex flex-wrap justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <UsersRound className="size-3.5" />
                  {batch.studentCount.toLocaleString("bn-BD")} শিক্ষার্থী
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  পরীক্ষা {batch.nextExamLabel}
                </span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <p className="font-semibold">কোনো ব্যাচ পাওয়া যায়নি</p>
          <p className="mt-1 text-sm text-muted-foreground">খোঁজার শব্দ বা ফিল্টার পরিবর্তন করে দেখুন।</p>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-primary hover:underline"
            onClick={() => {
              setQuery("");
              setCourseFilter("all");
              setStatusFilter("all");
            }}
          >
            ফিল্টার মুছুন
          </button>
        </div>
      )}
    </main>
  );
}
