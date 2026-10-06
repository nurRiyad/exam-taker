import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "সহজে পরীক্ষা তৈরি",
    description: "কোর্সের বিষয় বেছে নিয়ে দ্রুত MCQ পরীক্ষা তৈরি করুন।",
  },
  {
    title: "মোবাইলেই পরীক্ষা",
    description: "যেকোনো জায়গা থেকে সহজে পরীক্ষা দিন, ফল দেখুন।",
  },
  {
    title: "দুর্বল বিষয় চিনুন",
    description: "ফলাফল দেখে বুঝুন কোন বিষয়ে আরও অনুশীলন দরকার।",
  },
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="w-fit rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              শিক্ষক ও শিক্ষার্থীদের জন্য
            </p>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                MCQ পরীক্ষায় <span className="text-primary">আরও প্রস্তুত</span> হোন
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                কোর্স খুঁজুন, MCQ পরীক্ষা দিন, আর ফলাফল থেকে বুঝে নিন পরেরবার কোন বিষয়ে মনোযোগ দেবেন।
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
                শুরু করুন
              </Link>
              <Link
                href="/courses"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
              >
                কোর্স দেখুন
              </Link>
            </div>
          </div>

          <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-secondary/70 via-card to-sky-100/70 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>এক জায়গায় পড়াশোনার প্রস্তুতি</CardTitle>
              <CardDescription>MCQ অনুশীলন, পরীক্ষা এবং ফলাফল—সব সহজভাবে।</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="rounded-xl bg-card p-4 ring-1 ring-border/70">
                <span className="mr-2 font-semibold text-primary">০১</span> পছন্দের কোর্স বেছে নিন
              </div>
              <div className="rounded-xl bg-card p-4 ring-1 ring-border/70">
                <span className="mr-2 font-semibold text-primary">০২</span> MCQ পরীক্ষায় অংশ নিন
              </div>
              <div className="rounded-xl bg-card p-4 ring-1 ring-border/70">
                <span className="mr-2 font-semibold text-primary">০৩</span> ফল দেখে প্রস্তুতি এগিয়ে নিন
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
