import { notFound } from "next/navigation";
import { PublicCourseCard } from "@/components/public-course-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCoursesByTeacher, getPublicTeacher } from "@/lib/public-directory-data";

type TeacherDetailsPageProps = {
  params: Promise<{ teacherId: string }>;
};

export default async function TeacherDetailsPage({ params }: TeacherDetailsPageProps) {
  const { teacherId } = await params;
  const teacher = getPublicTeacher(teacherId);

  if (!teacher) notFound();

  const courses = getCoursesByTeacher(teacher.id);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="bg-secondary px-5 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_16rem] lg:items-center">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-lg bg-background px-2 py-1 text-foreground">{teacher.subject}</span>
                <span className="rounded-lg bg-background px-2 py-1 text-foreground">{teacher.location}</span>
                <span className="rounded-lg bg-background px-2 py-1 text-foreground">{teacher.institution}</span>
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{teacher.name}</h1>
                <p className="text-base font-medium text-muted-foreground">{teacher.specialty}</p>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{teacher.description}</p>
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-2 lg:max-w-lg">
                <div className="rounded-lg bg-background p-3">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="font-medium">{teacher.studentCount.toLocaleString("en")} learners</p>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <p className="text-xs text-muted-foreground">Courses</p>
                  <p className="font-medium">{courses.length} public courses</p>
                </div>
              </div>
            </div>
            <div className="flex justify-start lg:justify-end">
              <div className="flex size-36 items-center justify-center rounded-xl bg-background text-4xl font-semibold text-foreground ring-1 ring-border sm:size-44">
                {teacher.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {teacher.teachingStyle.map((style) => (
          <Card key={style} size="sm">
            <CardHeader>
              <CardDescription>Teaching focus</CardDescription>
              <CardTitle>{style}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Courses by {teacher.name}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Browse all public course routes currently available from this teacher.
          </p>
        </div>
        {courses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <PublicCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">
            This teacher does not have public courses yet.
          </div>
        )}
      </section>
    </main>
  );
}
