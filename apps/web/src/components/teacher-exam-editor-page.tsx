"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeacherBatchQuery } from "@/features/batches/queries";
import {
  useCreateTeacherExamMutation,
  useTeacherExamQuery,
  useUpdateTeacherExamMutation,
} from "@/features/exams/queries";
import { cn } from "@/utils/utils";

function dateParts(value?: string) {
  if (!value) return { date: "", time: "20:00" };
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

export function TeacherExamEditorPage({
  courseId,
  batchId,
  examId,
}: {
  courseId: string;
  batchId: string;
  examId?: string;
}) {
  const router = useRouter();
  const batchQuery = useTeacherBatchQuery(courseId, batchId);
  const examQuery = useTeacherExamQuery(courseId, batchId, examId ?? "", Boolean(examId));
  const create = useCreateTeacherExamMutation();
  const update = useUpdateTeacherExamMutation();
  const mutation = examId ? update : create;

  if (batchQuery.isPending || (examId && examQuery.isPending))
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6" role="status">
        পরীক্ষার তথ্য লোড হচ্ছে…
      </main>
    );
  if (batchQuery.isError || !batchQuery.data || (examId && (examQuery.isError || !examQuery.data)))
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <p role="alert" className="text-sm text-destructive">
          পরীক্ষার তথ্য আনা যায়নি। আবার চেষ্টা করুন।
        </p>
      </main>
    );
  const batch = batchQuery.data.batch;
  const exam = examQuery.data?.exam;
  const schedule = dateParts(exam?.startsAt ?? (batch.firstExamDate ? `${batch.firstExamDate}T20:00:00Z` : undefined));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "20:00");
    const input = {
      title: String(data.get("title") ?? "").trim(),
      topicText: String(data.get("topicText") ?? "").trim() || null,
      startsAt: new Date(`${date}T${time}:00`).toISOString(),
      durationMinutes: Number(data.get("durationMinutes") ?? 60),
      totalMarks: Number(data.get("totalMarks") ?? 0) || null,
      markPerCorrect: Number(data.get("markPerCorrect") ?? 1),
      negativeMarkingEnabled: data.get("negativeMarkingEnabled") === "on",
      negativeMarkPerWrong: Number(data.get("negativeMarkPerWrong") ?? 0),
      answerChangeAllowed: true,
      autosaveEnabled: true,
      mockEnabled: false,
      mockRetryLimit: null,
      resultReleaseMode: "automatic" as const,
      resultReleaseAt: null,
      status: String(data.get("status") ?? "draft") as "draft" | "published",
    };
    try {
      if (examId) await update.mutateAsync({ courseId, batchId, examId, input });
      else await create.mutateAsync({ courseId, batchId, input });
      router.push(`/teacher/courses/${courseId}/batches/${batchId}`);
    } catch {
      // The form stays mounted so entered values can be corrected or retried.
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-8 sm:px-6">
      <Link
        href={`/teacher/courses/${courseId}/batches/${batchId}`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        পরীক্ষার তালিকায় ফিরুন
      </Link>
      <header>
        <p className="text-sm font-medium text-primary">{batch.title}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{examId ? "পরীক্ষা সম্পাদনা" : "নতুন পরীক্ষা"}</h1>
      </header>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>পরীক্ষার তথ্য</CardTitle>
            <CardDescription>পরীক্ষার নাম, সময়সূচি ও নম্বর নির্ধারণ করুন।</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="exam-title">পরীক্ষার নাম</Label>
              <Input id="exam-title" name="title" defaultValue={exam?.title ?? ""} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-date">তারিখ</Label>
              <Input id="exam-date" name="date" type="date" defaultValue={schedule.date} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-time">সময়</Label>
              <Input id="exam-time" name="time" type="time" defaultValue={schedule.time} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-duration">সময় (মিনিট)</Label>
              <Input
                id="exam-duration"
                name="durationMinutes"
                type="number"
                min="1"
                defaultValue={exam?.durationMinutes ?? 60}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-total-marks">মোট নম্বর</Label>
              <Input
                id="exam-total-marks"
                name="totalMarks"
                type="number"
                min="1"
                step="any"
                defaultValue={exam?.totalMarks ?? 30}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-mark-per-correct">প্রতি সঠিক উত্তরে নম্বর</Label>
              <Input
                id="exam-mark-per-correct"
                name="markPerCorrect"
                type="number"
                min="0.01"
                step="any"
                defaultValue={exam?.markPerCorrect ?? 1}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-status">অবস্থা</Label>
              <Select
                name="status"
                items={[
                  { value: "draft", label: "খসড়া" },
                  { value: "published", label: "প্রকাশিত" },
                ]}
                defaultValue={exam?.status ?? "draft"}
              >
                <SelectTrigger id="exam-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="draft">খসড়া</SelectItem>
                    <SelectItem value="published">প্রকাশিত</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                name="negativeMarkingEnabled"
                defaultChecked={exam?.negativeMarkingEnabled ?? false}
                className="size-4 accent-primary"
              />
              ভুল উত্তরে নম্বর কাটা হবে
            </label>
            <div className="grid gap-2">
              <Label htmlFor="exam-negative-mark">প্রতি ভুল উত্তরে কর্তন</Label>
              <Input
                id="exam-negative-mark"
                name="negativeMarkPerWrong"
                type="number"
                min="0"
                step="any"
                defaultValue={exam?.negativeMarkPerWrong ?? 0}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="exam-topics">পরীক্ষার টপিক</Label>
              <textarea
                id="exam-topics"
                name="topicText"
                defaultValue={exam?.topicText ?? ""}
                rows={4}
                placeholder="প্রতি লাইনে একটি বিষয়"
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </CardContent>
        </Card>
        {mutation.isError ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            পরীক্ষার তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।
          </p>
        ) : null}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href={`/teacher/courses/${courseId}/batches/${batchId}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            বাতিল
          </Link>
          <Button type="submit" disabled={mutation.isPending}>
            <Save aria-hidden="true" data-icon="inline-start" />
            {mutation.isPending ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ করুন"}
          </Button>
        </div>
      </form>
    </main>
  );
}
