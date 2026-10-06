import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBatches, getTeacherCourses } from "@/lib/course-batches";
import { cn } from "@/lib/utils";

export default function TeacherCoursesPage() {
  const courses = getTeacherCourses("mahbub-hasan");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-primary">শিক্ষক ড্যাশবোর্ড</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">আমার কোর্স</h1>
          <p className="text-sm text-muted-foreground">কোর্স বেছে নিয়ে তার ব্যাচগুলো পরিচালনা করুন।</p>
        </div>
        <Link href="/teacher/courses/new" className={cn(buttonVariants(), "w-fit")}>
          <Plus aria-hidden="true" data-icon="inline-start" /> নতুন কোর্স
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => {
          const batches = getCourseBatches(course.id);
          const studentTotal = batches.reduce((total, batch) => total + batch.studentCount, 0);
          return (
            <Link
              key={course.id}
              href={`/teacher/courses/${course.id}`}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Card className="h-full gap-0 transition-colors group-hover:bg-muted/20">
                <CardHeader className="gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {course.examCategory}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    />
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-4 flex items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
                  <span>{batches.length.toLocaleString("bn-BD")}টি ব্যাচ</span>
                  <span>{studentTotal.toLocaleString("bn-BD")} জন শিক্ষার্থী</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
