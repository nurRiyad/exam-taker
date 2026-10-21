"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PublicCourse } from "@/utils/public-directory-data";
import { cn } from "@/utils/utils";

export function LocalCourseEditor({ course }: { course: PublicCourse }) {
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-8 sm:px-6">
      <Link
        href={`/teacher/courses/${course.id}`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> কোর্সে ফিরুন
      </Link>
      <header>
        <p className="text-sm font-medium text-primary">কোর্সের পাবলিক তথ্য</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">কোর্স সম্পাদনা</h1>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>কোর্সের পরিচিতি</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="কোর্সের নাম">
              <Input name="title" defaultValue={course.title} required />
            </Field>
            <Field label="সংক্ষিপ্ত পরিচিতি">
              <textarea
                name="description"
                defaultValue={course.description}
                rows={3}
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>
            <Field label="বিস্তারিত পরিচিতি">
              <textarea
                name="fullDescription"
                defaultValue={course.fullDescription}
                rows={5}
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>
            <Field label="পরীক্ষার ধরন">
              <Input name="examCategory" defaultValue={course.examCategory} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="বিষয়">
                <Input name="subject" defaultValue={course.subject} required />
              </Field>
              <Field label="স্তর">
                <Input name="level" defaultValue={course.level} required />
              </Field>
            </div>
            <Field label="সাধারণ পাঠ্যসূচি">
              <textarea
                name="fullSyllabus"
                defaultValue={course.fullSyllabus}
                rows={4}
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>
            <Field label="কোর্সের মূল্য">
              <Input name="priceLabel" defaultValue={course.priceLabel} required />
            </Field>
            <Field label="শিক্ষার্থীদের জন্য শেখার ফলাফল">
              <textarea
                name="outcomes"
                defaultValue={course.outcomes.join("\n")}
                rows={4}
                placeholder="প্রতি লাইনে একটি ফলাফল"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>
            <Field label="প্রস্তাবিত উপকরণ">
              <textarea
                name="recommendedResources"
                defaultValue={course.recommendedResources.join("\n")}
                rows={4}
                placeholder="প্রতি লাইনে একটি উপকরণ"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>
          </CardContent>
        </Card>
        {saved ? (
          <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
            কোর্সের তথ্য সংরক্ষিত হয়েছে। (ডেমো—রিফ্রেশের পর থাকবে না।)
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Link href={`/teacher/courses/${course.id}`} className={cn(buttonVariants({ variant: "outline" }))}>
            বাতিল
          </Link>
          <Button type="submit">
            <Save data-icon="inline-start" />
            সংরক্ষণ করুন
          </Button>
        </div>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </Label>
  );
}
