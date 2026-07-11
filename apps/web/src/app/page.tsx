import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Create exams quickly",
    description: "Teachers can move from course plan to MCQ exam without fighting the tool.",
  },
  {
    title: "Take exams on mobile",
    description: "Students get a focused exam flow built first for small screens and real classrooms.",
  },
  {
    title: "See weak zones",
    description: "Results can turn attempts into personalized weak-zone insight for the next study session.",
  },
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-medium text-muted-foreground">For teachers and students</p>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Run exams faster. Learn weak zones sooner.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Exam Taker helps coaching teachers create MCQ exams quickly, lets students take them on mobile, and
                turns results into focused weak-zone guidance.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
                Create an account
              </Link>
              <Link
                href="/courses"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
              >
                Browse courses
              </Link>
            </div>
          </div>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Simple exam operations</CardTitle>
              <CardDescription>Draft, publish, attempt, rank, and learn from one focused workspace.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="rounded-lg bg-background p-4 ring-1 ring-border">
                Course-first exam planning for teachers.
              </div>
              <div className="rounded-lg bg-background p-4 ring-1 ring-border">
                Mobile-first exam taking for students.
              </div>
              <div className="rounded-lg bg-background p-4 ring-1 ring-border">
                Results that point to the next weak topic.
              </div>
            </CardContent>
          </Card>
        </div>

        <section aria-label="Product highlights" className="grid gap-3 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} size="sm">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </section>
    </main>
  );
}
