"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenText, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatBanglaDate } from "@/lib/course-batches";
import { cn } from "@/lib/utils";

type Exam = {
  id: string;
  title: string;
  date: Date;
  questionCount: number;
  totalMarks: number;
  durationMinutes: number;
  stage: "আসন্ন" | "চলমান" | "শেষ";
  syllabus: string[];
};

export function ExamSchedule({ exams }: { exams: Exam[] }) {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedExam) return;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedExam(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedExam]);

  return (
    <>
      <div className="flex flex-col gap-2">
        {exams.map((exam) => (
          <article key={exam.id} className="rounded-lg bg-muted/50 p-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-medium">{exam.title}</span>
                  <span className="text-xs text-muted-foreground">{formatBanglaDate(exam.date)}</span>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${stageStyles[exam.stage]}`}>
                  {exam.stage}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{indexBangla(exam.questionCount)}টি প্রশ্ন</span>
                <span>{indexBangla(exam.totalMarks)} নম্বর</span>
                <span>{formatDuration(exam.durationMinutes)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full px-2 text-xs sm:text-sm"
                  onClick={() => setSelectedExam(exam)}
                  aria-label={`${exam.title} — সিলেবাস দেখুন`}
                >
                  <BookOpenText aria-hidden="true" data-icon="inline-start" />
                  সিলেবাস
                </Button>
                <Link
                  href={exam.stage === "শেষ" ? `/exams/${exam.id}/results` : `/exams/${exam.id}/attempt`}
                  className={cn(
                    buttonVariants({ variant: exam.stage === "শেষ" ? "secondary" : "default", size: "sm" }),
                    "w-full px-2 text-xs sm:text-sm",
                  )}
                >
                  {exam.stage === "শেষ" ? "ফলাফল দেখুন" : "পরীক্ষা শুরু করুন"}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedExam ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedExam(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="exam-syllabus-title"
            className="flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-2xl border bg-background shadow-xl sm:rounded-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b p-4 sm:p-5">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-xs font-medium text-primary">
                  পরীক্ষার সিলেবাস · {indexBangla(exams.findIndex((exam) => exam.id === selectedExam.id) + 1)}
                </p>
                <h2 id="exam-syllabus-title" className="text-lg font-semibold leading-snug">
                  {selectedExam.title}
                </h2>
                <p className="text-sm text-muted-foreground">{formatBanglaDate(selectedExam.date)}</p>
              </div>
              <Button
                ref={closeButtonRef}
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedExam(null)}
                aria-label="সিলেবাস বন্ধ করুন"
              >
                <X aria-hidden="true" />
              </Button>
            </header>
            <div className="overflow-y-auto overscroll-contain p-4 sm:p-5">
              <h3 className="mb-3 text-sm font-medium">এই পরীক্ষায় যা থাকবে</h3>
              <ol className="flex flex-col gap-2">
                {selectedExam.syllabus.map((topic, index) => (
                  <li key={`${topic}-${index}`} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background text-xs font-medium text-muted-foreground">
                      {indexBangla(index + 1)}
                    </span>
                    <span className="pt-0.5 leading-5">{topic}</span>
                  </li>
                ))}
              </ol>
            </div>
            <footer className="border-t p-4 sm:p-5">
              <Button type="button" className="w-full" onClick={() => setSelectedExam(null)}>
                বুঝেছি
              </Button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}

const stageStyles: Record<Exam["stage"], string> = {
  আসন্ন: "bg-secondary text-secondary-foreground",
  চলমান: "bg-primary/10 text-primary",
  শেষ: "bg-muted text-muted-foreground",
};

function indexBangla(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return `${indexBangla(hours)} ঘণ্টা ${indexBangla(minutes)} মিনিট`;
  if (hours) return `${indexBangla(hours)} ঘণ্টা`;
  return `${indexBangla(minutes)} মিনিট`;
}
