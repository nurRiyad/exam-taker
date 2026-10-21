"use client";

import { Button } from "@/components/ui/button";
import { TeacherCourseEditor } from "@/components/teacher-course-editor";
import { useTeacherCoursesQuery } from "@/features/courses/queries";

export function TeacherCourseEditPage({ courseId }: { courseId: string }) {
  const query = useTeacherCoursesQuery();
  if (query.isPending)
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8" role="status">
        কোর্স লোড হচ্ছে…
      </main>
    );
  const course = query.data?.courses.find((item) => item.id === courseId);
  if (query.isError || !course)
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <p role="alert" className="text-sm text-destructive">
          কোর্সটি পাওয়া যায়নি।
        </p>
        <Button variant="outline" className="mt-3" onClick={() => query.refetch()}>
          আবার চেষ্টা করুন
        </Button>
      </main>
    );
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <TeacherCourseEditor key={course.id} course={course} />
    </main>
  );
}
