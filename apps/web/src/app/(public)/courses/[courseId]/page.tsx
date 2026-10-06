import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { CourseBatchDirectory } from "@/components/course-batch-directory";
import { Card, CardContent } from "@/components/ui/card";
import { getCourseBatches } from "@/lib/course-batches";
import { getExamCategoryLabel, getPublicCourse, getPublicTeacher } from "@/lib/public-directory-data";

type CourseDetailsPageProps = { params: Promise<{ courseId: string }> };

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { courseId } = await params;
  const course = getPublicCourse(courseId);
  if (!course) notFound();
  const teacher = getPublicTeacher(course.teacherId);
  const batches = getCourseBatches(course.id);
  const categoryLabel = getExamCategoryLabel(course.examCategory);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href="/courses"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        কোর্স তালিকায় ফিরুন
      </Link>
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <h1
              title={course.title}
              className="min-w-0 flex-1 truncate whitespace-nowrap text-xl font-semibold tracking-tight sm:text-2xl"
            >
              {course.title}
            </h1>
            <span className="hidden shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground sm:inline-flex">
              {categoryLabel}
            </span>
            <span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              {course.priceLabel}
            </span>
          </div>
          <p className="line-clamp-2 max-w-4xl text-sm leading-5 text-muted-foreground">{course.fullDescription}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 pt-3 text-sm">
            {teacher ? (
              <Link href={`/teachers/${teacher.id}`} className="font-medium underline-offset-4 hover:underline">
                শিক্ষক: {teacher.name}
              </Link>
            ) : null}
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <GraduationCap aria-hidden="true" className="size-4" />
              {course.examCount.toLocaleString("bn-BD")}টি পরীক্ষা
            </span>
            <span className="text-muted-foreground">{batches.length.toLocaleString("bn-BD")}টি ব্যাচ</span>
          </div>
        </div>
      </section>

      <CourseBatchDirectory courseId={course.id} batches={batches} />
    </main>
  );
}
