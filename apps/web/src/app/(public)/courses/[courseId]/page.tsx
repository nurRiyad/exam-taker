import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicCourse, getPublicTeacher } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

type CourseDetailsPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { courseId } = await params;
  const course = getPublicCourse(courseId);

  if (!course) notFound();

  const teacher = getPublicTeacher(course.teacherId);
  const doneExamCount = course.examTopics.filter((topic) => topic.status === "Done").length;
  const upcomingExamCount = course.examTopics.filter((topic) => topic.status === "Upcoming").length;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="bg-secondary px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-3xl flex-col gap-4">
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-lg bg-background px-2 py-1 text-foreground">{course.subject}</span>
                <span className="rounded-lg bg-background px-2 py-1 text-foreground">{course.level}</span>
                <span className="rounded-lg bg-background px-2 py-1 text-foreground">{course.priceLabel}</span>
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">{course.fullDescription}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                By{" "}
                <Link
                  href={`/teachers/${course.teacherId}`}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {course.teacherName}
                </Link>
                {teacher ? ` · ${teacher.specialty}` : null}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto lg:w-44")}>
                Log in to join
              </Link>
              <Link
                href={`/teachers/${course.teacherId}`}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto lg:w-44")}
              >
                View teacher
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total exams", `${course.examCount} sets`],
          ["Next exam", course.nextExam],
          ["Students", course.studentCount.toLocaleString("en")],
          ["Participated", course.participantCount.toLocaleString("en")],
        ].map(([label, value]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle>{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Exam route</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Date-focused route list for this course. Completed exams show public activity; upcoming exams show the
                planned topic and schedule.
              </p>
            </div>
            <div className="grid gap-3">
              {course.examTopics.map((topic) => {
                const isUpcoming = topic.status === "Upcoming";

                return (
                  <Card
                    key={topic.id}
                    className={cn("border-muted/80", isUpcoming ? "bg-emerald-50/80" : "bg-rose-50/80")}
                  >
                    <CardHeader>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <CardTitle>{topic.title}</CardTitle>
                          <CardDescription>{topic.shortDescription}</CardDescription>
                        </div>
                        <span
                          className={cn(
                            "w-fit rounded-lg px-2 py-1 text-xs font-medium",
                            isUpcoming ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800",
                          )}
                        >
                          {topic.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-[13rem_1fr]">
                      <p className="font-medium text-foreground">{topic.scheduledAtLabel}</p>
                      <div className="flex flex-col gap-2">
                        <p>{topic.publicNote}</p>
                        {topic.status === "Done" ? (
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div className="rounded-lg bg-background/70 p-3">
                              <p className="text-xs text-muted-foreground">Participants</p>
                              <p className="font-medium text-foreground">
                                {topic.participantCount?.toLocaleString("en")}
                              </p>
                            </div>
                            <div className="rounded-lg bg-background/70 p-3">
                              <p className="text-xs text-muted-foreground">Top score</p>
                              <p className="font-medium text-foreground">
                                {topic.topScoreLabel} · {topic.topScoreUsername}
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Course status</CardTitle>
              <CardDescription>Quick public snapshot for this course route.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Enrolled students</p>
                <p className="font-medium">{course.studentCount.toLocaleString("en")}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total participants</p>
                <p className="font-medium">{course.participantCount.toLocaleString("en")}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="font-medium">
                  {doneExamCount} done · {upcomingExamCount} left
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-medium">{course.discountLabel ?? course.priceLabel}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Teacher resources</CardTitle>
              <CardDescription>Suggested books and study materials for this course.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {course.recommendedResources.map((resource) => (
                  <li key={resource} className="rounded-lg bg-muted/50 p-3">
                    {resource}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
