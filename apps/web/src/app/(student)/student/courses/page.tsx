import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBatches } from "@/lib/course-batches";
import { getPublicCourse } from "@/lib/public-directory-data";

const enrolled = [
  { courseId: "math-shortcut-practice", batchId: "bank-morning-2026" },
  { courseId: "bcs-english-foundation", batchId: "bcs-preli-2026" },
];

export default function StudentCoursesPage() {
  const items = enrolled.flatMap(({ courseId, batchId }) => {
    const course = getPublicCourse(courseId);
    const batch = getCourseBatches(courseId).find((item) => item.id === batchId);
    return course && batch ? [{ course, batch }] : [];
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header>
        <p className="text-sm font-medium text-primary">শিক্ষার্থী ড্যাশবোর্ড</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">আমার কোর্স</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          আপনি যে ব্যাচগুলোতে ভর্তি হয়েছেন, সেগুলোর পরীক্ষা ও উপকরণ এখানে পাবেন।
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map(({ course, batch }) => (
          <Link
            key={batch.id}
            href={`/student/courses/${course.id}/batches/${batch.id}`}
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Card className="h-full gap-0 transition-colors group-hover:bg-muted/20">
              <CardHeader className="gap-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">{course.examCategory}</span>
                  <BookOpenCheck aria-hidden="true" className="size-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-base">{batch.title}</CardTitle>
                <CardDescription>{course.title}</CardDescription>
              </CardHeader>
              <CardContent className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-muted-foreground">
                  {batch.syllabus.length.toLocaleString("bn-BD")}টি টপিক ·{" "}
                  {batch.examIntervalDays.toLocaleString("bn-BD")} দিন পরপর পরীক্ষা
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-primary transition-transform group-hover:translate-x-1"
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            আপনি এখনো কোনো ব্যাচে ভর্তি হননি।
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
