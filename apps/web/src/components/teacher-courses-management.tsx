"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Pencil, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCourseBatches, getTeacherCourses } from "@/utils/course-batches";
import { cn } from "@/utils/utils";

export function TeacherCoursesManagement() {
  const courses = getTeacherCourses("kafi");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">শিক্ষক ড্যাশবোর্ড</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">আমার কোর্স</h1>
          <p className="mt-1 text-sm text-muted-foreground">কোর্স বেছে নিয়ে ব্যাচ ও পরীক্ষা পরিচালনা করুন।</p>
        </div>
        <Link href="/teacher/courses/new" className={cn(buttonVariants(), "w-fit")}>
          <Plus aria-hidden="true" data-icon="inline-start" />
          নতুন কোর্স
        </Link>
      </header>
      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">এখনো কোনো কোর্স নেই</p>
            <p className="mt-1 text-sm text-muted-foreground">প্রথম কোর্সটি তৈরি করে শুরু করুন।</p>
          </CardContent>
        </Card>
      ) : null}
      {courses.length ? (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 p-3 sm:gap-4 sm:p-4 ${index ? "border-t" : ""}`}
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
                    {course.examCategory} · {getCourseBatches(course.id).length.toLocaleString("bn-BD")}টি ব্যাচ
                  </span>
                </span>
              </Link>
              <Link
                href={`/teacher/courses/${course.id}/edit`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "shrink-0 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground",
                )}
                aria-label={`${course.title} সম্পাদনা`}
              >
                <Pencil data-icon="inline-start" /> সম্পাদনা
              </Link>
              <Link
                href={`/teacher/courses/${course.id}`}
                aria-label={`${course.title} খুলুন`}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
}
