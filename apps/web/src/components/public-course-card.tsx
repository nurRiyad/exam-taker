import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicCourse } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

export function PublicCourseCard({ course }: { course: PublicCourse }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground">{course.subject}</p>
            <CardTitle className="text-lg">{course.title}</CardTitle>
          </div>
          <span className="shrink-0 rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
            {course.priceLabel}
          </span>
        </div>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid gap-2 text-sm">
          <p>
            <span className="text-muted-foreground">Teacher:</span>{" "}
            <Link href={`/teachers/${course.teacherId}`} className="font-medium underline-offset-4 hover:underline">
              {course.teacherName}
            </Link>
          </p>
          <p>
            <span className="text-muted-foreground">Level:</span> {course.level}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Exams</p>
            <p className="font-medium">{course.examCount} sets</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Schedule</p>
            <p className="font-medium">{course.nextExam}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${course.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          View course
        </Link>
      </CardFooter>
    </Card>
  );
}