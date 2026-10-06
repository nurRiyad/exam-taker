"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CourseBatch } from "@/lib/course-batches";

export function NewBatchExamForm({ courseId, batch }: { courseId: string; batch: CourseBatch }) {
  const [added, setAdded] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdded(true);
  }
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-8 sm:px-6">
      <Link
        href={`/teacher/courses/${courseId}/batches/${batch.id}/exams`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        ব্যাচের পরীক্ষায় ফিরুন
      </Link>
      <header>
        <p className="text-sm font-medium text-primary">{batch.title}</p>
        <h1 className="text-2xl font-semibold tracking-tight">নতুন পরীক্ষা</h1>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>পরীক্ষার তথ্য</CardTitle>
            <CardDescription>এই পরীক্ষা কেবল এই ব্যাচের শিক্ষার্থীদের জন্য তৈরি হবে।</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-exam-name">পরীক্ষার নাম</Label>
              <Input id="new-exam-name" placeholder="যেমন: শতকরা অধ্যায় পরীক্ষা" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="new-exam-day">তারিখ</Label>
                <Input id="new-exam-day" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-exam-hour">সময়</Label>
                <Input id="new-exam-hour" defaultValue={batch.examTime} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-exam-syllabus">পরীক্ষার টপিক</Label>
              <textarea
                id="new-exam-syllabus"
                rows={3}
                placeholder="এই পরীক্ষায় কোন বিষয়গুলো থাকবে?"
                required
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </CardContent>
        </Card>
        {added ? (
          <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
            পরীক্ষা তৈরি হয়েছে। (ডেমো—রিফ্রেশের পর থাকবে না।)
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit">
            <Plus aria-hidden="true" data-icon="inline-start" />
            পরীক্ষা তৈরি করুন
          </Button>
        </div>
      </form>
    </main>
  );
}
