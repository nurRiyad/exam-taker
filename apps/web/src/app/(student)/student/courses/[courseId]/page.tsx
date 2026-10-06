import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BatchCard } from "@/components/batch-card";
import { getCourseBatches } from "@/lib/course-batches";
import { getPublicCourse } from "@/lib/public-directory-data";

export default async function StudentCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getPublicCourse(courseId);
  if (!course) notFound();
  const batches = getCourseBatches(course.id).filter(
    (batch) => batch.id === "bank-morning-2026" || batch.id === "bcs-preli-2026",
  );
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 py-8 sm:px-6">
      <Link
        href="/student/courses"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        আমার কোর্স
      </Link>
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
        <p className="text-sm text-muted-foreground">এই কোর্সে আপনার ভর্তি হওয়া ব্যাচ।</p>
      </header>
      {batches.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {batches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              href={`/student/courses/${course.id}/batches/${batch.id}`}
              actionLabel="ব্যাচে যান"
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">এই কোর্সে আপনার কোনো ব্যাচ নেই।</p>
      )}
    </main>
  );
}
