"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CourseBatch } from "@/lib/course-batches";

export function ExamDetailsForm({
  courseId,
  batch,
  exam,
}: {
  courseId: string;
  batch: CourseBatch;
  exam: { id: string; title: string; date: string };
}) {
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-8 sm:px-6">
      <Link
        href={`/teacher/courses/${courseId}/batches/${batch.id}/exams`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        পরীক্ষার তালিকায় ফিরুন
      </Link>
      <header>
        <p className="text-sm font-medium text-primary">{batch.title}</p>
        <h1 className="text-2xl font-semibold tracking-tight">পরীক্ষা সম্পাদনা</h1>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{exam.title}</CardTitle>
            <CardDescription>এই পরীক্ষার তথ্য শুধু নির্বাচিত ব্যাচের জন্য প্রযোজ্য।</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exam-name">পরীক্ষার নাম</Label>
              <Input id="exam-name" defaultValue={exam.title} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-schedule-date">তারিখ</Label>
              <Input id="exam-schedule-date" type="date" defaultValue={exam.date} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-schedule-time">সময়</Label>
              <Input id="exam-schedule-time" defaultValue={batch.examTime} required />
            </div>
          </CardContent>
        </Card>
        {saved ? (
          <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
            পরীক্ষার তথ্য সংরক্ষিত হয়েছে। (ডেমো—রিফ্রেশের পর থাকবে না।)
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit">
            <Save aria-hidden="true" data-icon="inline-start" />
            পরিবর্তন সংরক্ষণ
          </Button>
        </div>
      </form>
    </main>
  );
}
