"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CourseBatch } from "@/lib/course-batches";

type ExamItem = { id: string; title: string; date: Date };

export function BatchExamManager({
  courseId,
  batch,
  exams,
}: {
  courseId: string;
  batch: CourseBatch;
  exams: ExamItem[];
}) {
  const [items, setItems] = useState(
    exams.map((exam) => ({ ...exam, dateInput: exam.date.toISOString().slice(0, 10) })),
  );
  const [saved, setSaved] = useState(false);

  function updateExam(id: string, key: "title" | "dateInput", value: string) {
    setSaved(false);
    setItems((current) => current.map((exam) => (exam.id === id ? { ...exam, [key]: value } : exam)));
  }

  function addExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const dateInput = String(form.get("date") ?? "");
    if (!title || !dateInput) return;
    setItems((current) => [
      ...current,
      { id: `custom-${Date.now()}`, title, dateInput, date: new Date(`${dateInput}T12:00:00`) },
    ]);
    event.currentTarget.reset();
    setSaved(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href={`/teacher/courses/${courseId}/batches/${batch.id}`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        ব্যাচে ফিরুন
      </Link>
      <header>
        <p className="text-sm font-medium text-primary">{batch.title}</p>
        <h1 className="text-2xl font-semibold tracking-tight">পরীক্ষার সময়সূচি</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          প্রতি {batch.examIntervalDays.toLocaleString("bn-BD")} দিন পরপর · {batch.examTime}
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {items.map((exam, index) => (
          <Card key={exam.id} size="sm">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor={`exam-title-${exam.id}`}>পরীক্ষা {index + 1} · নাম</Label>
                  <Input
                    id={`exam-title-${exam.id}`}
                    value={exam.title}
                    onChange={(event) => updateExam(exam.id, "title", event.target.value)}
                  />
                </div>
                <div className="grid gap-2 sm:w-52">
                  <Label htmlFor={`exam-date-${exam.id}`}>তারিখ</Label>
                  <Input
                    id={`exam-date-${exam.id}`}
                    type="date"
                    value={exam.dateInput}
                    onChange={(event) => updateExam(exam.id, "dateInput", event.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <form
        onSubmit={addExam}
        className="grid gap-3 rounded-xl border border-dashed p-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end"
      >
        <div className="grid gap-2">
          <Label htmlFor="new-exam-title">নতুন পরীক্ষার নাম</Label>
          <Input id="new-exam-title" name="title" placeholder="যেমন: শতকরা অধ্যায় পরীক্ষা" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-exam-date">পরীক্ষার তারিখ</Label>
          <Input id="new-exam-date" name="date" type="date" required />
        </div>
        <Button type="submit" variant="outline">
          <Plus aria-hidden="true" data-icon="inline-start" />
          পরীক্ষা যোগ
        </Button>
      </form>
      {saved ? (
        <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
          পরীক্ষার সময়সূচি সংরক্ষিত হয়েছে। (ডেমো—রিফ্রেশের পর থাকবে না।)
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-4" />
          তারিখগুলো ব্যাচের পরীক্ষার্থীদের জন্য প্রযোজ্য।
        </p>
        <Button onClick={() => setSaved(true)}>
          <Save aria-hidden="true" data-icon="inline-start" />
          সময়সূচি সংরক্ষণ
        </Button>
      </div>
    </main>
  );
}
