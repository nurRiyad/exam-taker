"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Pencil, Plus, RotateCw, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherBatchQuery } from "@/features/batches/queries";
import { useDeleteTeacherExamMutation, useTeacherExamsQuery } from "@/features/exams/queries";
import { cn } from "@/utils/utils";

function asDate(value: string) {
  const normalized = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  return new Date(normalized);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeStyle: "short" }).format(asDate(value));
}

export function TeacherBatchExamPage({ courseId, batchId }: { courseId: string; batchId: string }) {
  const batchQuery = useTeacherBatchQuery(courseId, batchId);
  const examsQuery = useTeacherExamsQuery(courseId, batchId);
  const remove = useDeleteTeacherExamMutation();
  const [error, setError] = useState(false);

  if (batchQuery.isPending || examsQuery.isPending)
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6" role="status">
        ব্যাচের পরীক্ষা লোড হচ্ছে…
      </main>
    );
  if (batchQuery.isError || examsQuery.isError || !batchQuery.data || !examsQuery.data)
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start gap-4 px-4 py-8 sm:px-6">
        <p role="alert" className="text-sm text-destructive">
          ব্যাচের পরীক্ষার তথ্য আনা যায়নি। আবার চেষ্টা করুন।
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void batchQuery.refetch();
            void examsQuery.refetch();
          }}
        >
          <RotateCw aria-hidden="true" data-icon="inline-start" />
          আবার চেষ্টা
        </Button>
      </main>
    );
  const { batch } = batchQuery.data;
  const { exams } = examsQuery.data;

  function deleteExam(examId: string, title: string) {
    if (window.confirm(`“${title}” পরীক্ষাটি মুছে ফেলতে চান?`)) {
      remove.mutate({ courseId, batchId, examId }, { onError: () => setError(true), onSuccess: () => setError(false) });
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href={`/teacher/courses/${courseId}`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        কোর্সের ব্যাচে ফিরুন
      </Link>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardDescription>
              ব্যাচ · {batch.status === "upcoming" ? "আসছে" : batch.status === "active" ? "চলমান" : "শেষ"}
            </CardDescription>
            <CardTitle className="text-xl sm:text-2xl">{batch.title}</CardTitle>
            <CardDescription className="max-w-3xl leading-6">{batch.description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/teacher/courses/${courseId}/batches/${batchId}/edit`}
              className={cn(buttonVariants({ variant: "outline" }), "w-fit shrink-0")}
            >
              <Pencil aria-hidden="true" data-icon="inline-start" />
              ব্যাচ সম্পাদনা
            </Link>
            <Link
              href={`/teacher/courses/${courseId}/batches/${batchId}/exams/new`}
              className={cn(buttonVariants(), "w-fit shrink-0")}
            >
              <Plus aria-hidden="true" data-icon="inline-start" />
              পরীক্ষা যোগ
            </Link>
          </div>
        </CardHeader>
      </Card>
      <section className="flex flex-col gap-4" aria-labelledby="batch-exams-heading">
        <div>
          <h1 id="batch-exams-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            পরীক্ষার তালিকা
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">পরীক্ষার তথ্য সম্পাদনা করুন বা নতুন পরীক্ষা যোগ করুন।</p>
        </div>
        {error || remove.isError ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            পরীক্ষাটি মুছে ফেলা যায়নি। আবার চেষ্টা করুন।
          </p>
        ) : null}
        {exams.length ? (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
            {exams.map((exam, index) => (
              <div
                key={exam.id}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 p-3 sm:gap-4 sm:p-4",
                  index ? "border-t" : "",
                )}
              >
                <div className="min-w-0">
                  <span className="block truncate font-semibold">{exam.title}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {formatDate(exam.startsAt)} · {exam.durationMinutes.toLocaleString("bn-BD")} মিনিট ·{" "}
                    {exam.status === "published" ? "প্রকাশিত" : "খসড়া"}
                  </span>
                </div>
                <Link
                  href={`/teacher/courses/${courseId}/batches/${batchId}/exams/${exam.id}`}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0 px-2")}
                  aria-label={`${exam.title} সম্পাদনা`}
                >
                  <Pencil aria-hidden="true" className="size-4" />
                  <span className="hidden sm:inline">সম্পাদনা</span>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${exam.title} মুছুন`}
                  disabled={remove.isPending}
                  onClick={() => deleteExam(exam.id, exam.title)}
                >
                  <Trash2 aria-hidden="true" className="size-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="font-medium">এখনো কোনো পরীক্ষা নেই</p>
              <p className="mt-1 text-sm text-muted-foreground">এই ব্যাচের প্রথম পরীক্ষা যোগ করুন।</p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
