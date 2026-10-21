"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, Pencil, Plus, RotateCw, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TeacherCourse } from "@/features/courses/api";
import {
  useDeleteTeacherCourseMutation,
  useTeacherCoursesQuery,
  useUpdateTeacherCourseMutation,
} from "@/features/courses/queries";
import { cn } from "@/utils/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TeacherCoursesManagement() {
  const query = useTeacherCoursesQuery();
  const remove = useDeleteTeacherCourseMutation();
  const update = useUpdateTeacherCourseMutation();
  const [statusCourse, setStatusCourse] = useState<TeacherCourse | null>(null);
  const [nextStatus, setNextStatus] = useState<"draft" | "published">("draft");

  function openStatusDialog(course: TeacherCourse) {
    update.reset();
    setStatusCourse(course);
    setNextStatus(course.status === "published" ? "published" : "draft");
  }

  async function saveStatus() {
    if (!statusCourse) return;
    try {
      await update.mutateAsync({ id: statusCourse.id, input: { status: nextStatus } });
      setStatusCourse(null);
    } catch {
      // Keep the dialog open so the teacher can correct the course or retry.
    }
  }

  function deleteCourse(id: string, title: string) {
    if (window.confirm(`“${title}” কোর্সটি তালিকা থেকে সরাতে চান?`)) remove.mutate(id);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">শিক্ষক ড্যাশবোর্ড</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">আমার কোর্স</h1>
          <p className="mt-1 text-sm text-muted-foreground">কোর্স বেছে নিয়ে ব্যাচ ও পরীক্ষা পরিচালনা করুন।</p>
        </div>
        <Link href="/teacher/courses/new" className={cn(buttonVariants(), "w-fit")}>
          <Plus aria-hidden="true" data-icon="inline-start" /> নতুন কোর্স
        </Link>
      </header>

      {query.isPending ? (
        <Card role="status">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">কোর্স লোড হচ্ছে…</CardContent>
        </Card>
      ) : null}

      {query.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p role="alert" className="text-sm text-destructive">
              কোর্সের তালিকা আনা যায়নি। আবার চেষ্টা করুন।
            </p>
            <Button type="button" variant="outline" onClick={() => query.refetch()}>
              <RotateCw aria-hidden="true" data-icon="inline-start" /> আবার চেষ্টা
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {remove.isError ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          কোর্সটি সরানো যায়নি। আবার চেষ্টা করুন।
        </p>
      ) : null}

      {query.isSuccess && query.data.courses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">এখনো কোনো কোর্স নেই</p>
            <p className="mt-1 text-sm text-muted-foreground">প্রথম কোর্সটি তৈরি করে শুরু করুন।</p>
          </CardContent>
        </Card>
      ) : null}

      {query.isSuccess && query.data.courses.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          {query.data.courses.map((course, index) => (
            <div
              key={course.id}
              className={`grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-1 p-3 sm:gap-3 sm:p-4 ${index ? "border-t" : ""}`}
            >
              <Link
                href={`/teacher/courses/${course.id}`}
                className="group flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <BookOpen className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{course.title}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {course.shortDescription || "কোর্স পরিচিতি যোগ করা হয়নি"}
                  </span>
                </span>
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 px-2 text-xs"
                onClick={() => openStatusDialog(course)}
                aria-label={`${course.title} কোর্সের অবস্থা পরিবর্তন`}
              >
                {course.status === "published" ? "প্রকাশিত" : "খসড়া"}
              </Button>
              <Link
                href={`/teacher/courses/${course.id}/edit`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "shrink-0 gap-1 px-2 text-muted-foreground",
                )}
                aria-label={`${course.title} সম্পাদনা`}
              >
                <Pencil aria-hidden="true" className="size-4" />
                <span className="hidden sm:inline">সম্পাদনা</span>
              </Link>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${course.title} মুছুন`}
                  disabled={remove.isPending}
                  onClick={() => deleteCourse(course.id, course.title)}
                >
                  <Trash2 aria-hidden="true" className="size-4 text-muted-foreground" />
                </Button>
                <Link
                  href={`/teacher/courses/${course.id}`}
                  aria-label={`${course.title} খুলুন`}
                  className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {statusCourse ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setStatusCourse(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-status-title"
            className="w-full max-w-md rounded-xl border bg-card p-5 shadow-lg"
          >
            <h2 id="course-status-title" className="text-lg font-semibold">
              কোর্সের অবস্থা পরিবর্তন
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{statusCourse.title}</p>
            <label className="mt-5 grid gap-2 text-sm font-medium">
              নতুন অবস্থা
              <Select value={nextStatus} onValueChange={(value) => setNextStatus(value as "draft" | "published")}>
                <SelectTrigger aria-label="নতুন অবস্থা">
                  <SelectValue>{nextStatus === "published" ? "প্রকাশিত" : "খসড়া"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="draft">খসড়া</SelectItem>
                    <SelectItem value="published">প্রকাশিত</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
            {update.isError ? (
              <p role="alert" className="mt-3 text-sm text-destructive">
                অবস্থা পরিবর্তন করা যায়নি। কোর্সের তথ্য পূরণ করে আবার চেষ্টা করুন।
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setStatusCourse(null)} disabled={update.isPending}>
                বাতিল
              </Button>
              <Button
                type="button"
                onClick={saveStatus}
                disabled={update.isPending || nextStatus === statusCourse.status}
              >
                {update.isPending ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ করুন"}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
