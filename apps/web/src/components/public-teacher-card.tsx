import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicTeacher } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

function formatCount(count: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(count);
}

export function PublicTeacherCard({ teacher }: { teacher: PublicTeacher }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-base font-semibold text-secondary-foreground">
            {teacher.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{teacher.subject}</p>
            <CardTitle className="text-lg">{teacher.name}</CardTitle>
            <CardDescription>{teacher.specialty}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm leading-6 text-muted-foreground">{teacher.bio}</p>
        <div className="grid gap-2 text-sm">
          <p>
            <span className="text-muted-foreground">Institution:</span> {teacher.institution}
          </p>
          <p>
            <span className="text-muted-foreground">Location:</span> {teacher.location}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Students</p>
            <p className="font-medium">{formatCount(teacher.studentCount)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Courses</p>
            <p className="font-medium">{teacher.courseCount}</p>
          </div>
        </div>
        <div className="rounded-lg border p-3 text-sm">
          <p className="text-xs text-muted-foreground">Popular course</p>
          <Link href={`/courses/${teacher.popularCourseId}`} className="font-medium underline-offset-4 hover:underline">
            {teacher.popularCourseTitle}
          </Link>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/teachers/${teacher.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          View teacher
        </Link>
      </CardFooter>
    </Card>
  );
}