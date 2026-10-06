"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Flag, ListChecks, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Question = { prompt: string; options: string[]; answer: number };

const baseQuestions: Question[] = [
  {
    prompt: "একটি পণ্যের ক্রয়মূল্য ৮০০ টাকা। ১৫% লাভে বিক্রয়মূল্য কত?",
    options: ["৯০০ টাকা", "৯২০ টাকা", "৯৪০ টাকা", "৯৬০ টাকা"],
    answer: 1,
  },
  { prompt: "৩ : ৫ অনুপাতের দুটি সংখ্যার যোগফল ৬৪ হলে বড় সংখ্যাটি কত?", options: ["২৪", "৩২", "৪০", "৪৮"], answer: 2 },
  {
    prompt: "একটি কাজ ১২ দিনে শেষ হয়। ৪ জনে সমান হারে কাজটি করলে কত দিন লাগবে?",
    options: ["৩ দিন", "৪ দিন", "৬ দিন", "৮ দিন"],
    answer: 0,
  },
  { prompt: "০.২৫ কে সাধারণ ভগ্নাংশে প্রকাশ করলে কোনটি হবে?", options: ["১/২", "১/৩", "১/৪", "৩/৪"], answer: 2 },
  { prompt: "একটি সংখ্যার ২০% হলো ৪৮। সংখ্যাটি কত?", options: ["১৯২", "২১৬", "২৪০", "২৬০"], answer: 2 },
  { prompt: "৫, ৯, ১৩, ১৭, ... ধারাটির পরের সংখ্যাটি কত?", options: ["১৯", "২০", "২১", "২২"], answer: 2 },
  {
    prompt: "৬০ কিমি/ঘণ্টা বেগে ২.৫ ঘণ্টায় কত দূরত্ব অতিক্রম হবে?",
    options: ["১২০ কিমি", "১৩০ কিমি", "১৪০ কিমি", "১৫০ কিমি"],
    answer: 3,
  },
  {
    prompt: "একটি পণ্যের দাম ১০% কমে ৪৫০ টাকা হলো। আগের দাম কত ছিল?",
    options: ["৪৮০ টাকা", "৫০০ টাকা", "৫২০ টাকা", "৫৫০ টাকা"],
    answer: 1,
  },
  { prompt: "১৫ ও ২০-এর ল.সা.গু কত?", options: ["৩০", "৪৫", "৬০", "৯০"], answer: 2 },
  {
    prompt: "একটি আয়তক্ষেত্রের দৈর্ঘ্য ১২ মিটার এবং প্রস্থ ৭ মিটার। ক্ষেত্রফল কত?",
    options: ["৩৮ বর্গমিটার", "৭৬ বর্গমিটার", "৮৪ বর্গমিটার", "৯৬ বর্গমিটার"],
    answer: 2,
  },
  {
    prompt: "৮ জন শ্রমিক একটি কাজ ১৫ দিনে করেন। ১২ জনে কাজটি কত দিনে করবেন?",
    options: ["৮ দিন", "১০ দিন", "১২ দিন", "১৪ দিন"],
    answer: 1,
  },
  { prompt: "২, ৬, ১৮, ৫৪, ... ধারাটির পরের পদ কোনটি?", options: ["১০৮", "১২৬", "১৪৪", "১৬২"], answer: 3 },
  { prompt: "একটি সংখ্যার ৩/৫ অংশ ৪২ হলে সংখ্যাটি কত?", options: ["৬০", "৬৫", "৭০", "৭৫"], answer: 2 },
  {
    prompt: "বার্ষিক ৮% সরল সুদে ৫,০০০ টাকার ২ বছরের সুদ কত?",
    options: ["৬০০ টাকা", "৭০০ টাকা", "৮০০ টাকা", "৯০০ টাকা"],
    answer: 2,
  },
  { prompt: "৪৮ ও ৬০-এর গ.সা.গু কত?", options: ["৬", "৮", "১২", "১৬"], answer: 2 },
  {
    prompt: "একটি পরীক্ষায় ৮০টির মধ্যে ৬৮টি সঠিক হলে সঠিক উত্তরের হার কত?",
    options: ["৮০%", "৮২.৫%", "৮৫%", "৮৭.৫%"],
    answer: 2,
  },
  {
    prompt: "একটি নৌকা স্রোতের অনুকূলে ঘণ্টায় ১২ কিমি এবং প্রতিকূলে ৮ কিমি চলে। স্থির পানিতে বেগ কত?",
    options: ["৮ কিমি/ঘণ্টা", "৯ কিমি/ঘণ্টা", "১০ কিমি/ঘণ্টা", "১২ কিমি/ঘণ্টা"],
    answer: 2,
  },
  { prompt: "x + ৭ = ১৯ হলে x-এর মান কত?", options: ["১০", "১১", "১২", "১৩"], answer: 2 },
  { prompt: "একটি বর্গের বাহু ৯ সেমি। পরিসীমা কত?", options: ["১৮ সেমি", "২৭ সেমি", "৩৬ সেমি", "৮১ সেমি"], answer: 2 },
  {
    prompt: "একটি পণ্যের ক্রয়মূল্য ১,২০০ টাকা ও বিক্রয়মূল্য ১,০২০ টাকা। ক্ষতির হার কত?",
    options: ["১০%", "১২%", "১৫%", "১৮%"],
    answer: 2,
  },
];

const questions = baseQuestions.map((question, index) => ({ ...question, id: index + 1 }));
const examDurationSeconds = 90 * 60;

export function ExamAttempt({ examId }: { examId: string }) {
  const examNumber = Number(examId.match(/exam-(\d+)$/)?.[1] ?? 1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(examDurationSeconds);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) return;
    const timerId = window.setInterval(() => {
      setRemainingSeconds((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timerId);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [isSubmitted]);

  const question = questions[activeIndex];
  const answeredCount = Object.keys(answers).length;
  const timeProgress = (remainingSeconds / examDurationSeconds) * 100;
  const formattedTime = useMemo(() => {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  }, [remainingSeconds]);

  function moveTo(index: number) {
    setActiveIndex(Math.min(Math.max(index, 0), questions.length - 1));
    setIsNavigatorOpen(false);
  }

  function submitExam() {
    setIsSubmitted(true);
    setIsSubmitOpen(false);
  }

  if (isSubmitted || remainingSeconds === 0) {
    const score = questions.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0);
    return (
      <main className="fixed inset-0 z-50 flex overflow-y-auto bg-background px-4 py-6 sm:items-center sm:justify-center sm:p-8">
        <section className="mx-auto my-auto flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 aria-hidden="true" className="size-7" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">পরীক্ষা জমা হয়েছে</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              আপনার উত্তর সংরক্ষণ করা হয়েছে। ডেমো ফলাফল: {bn(score)} / {bn(questions.length)}।
            </p>
          </div>
          <Link href="/student/exams" className={cn(buttonVariants(), "w-full")}>
            আমার পরীক্ষায় ফিরুন
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-background">
      <header className="shrink-0 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-3 py-2 sm:px-6 sm:py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/student/exams"
              aria-label="পরীক্ষা ছেড়ে বের হন"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">ব্যাংক নিয়োগ · পরীক্ষা {bn(examNumber)}</p>
              <p className="text-xs text-muted-foreground">গণিত অনুশীলন</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 tabular-nums" aria-live="off">
            <Clock3
              aria-hidden="true"
              className={cn("size-4", remainingSeconds <= 300 ? "text-destructive" : "text-muted-foreground")}
            />
            <span className={cn("text-sm font-semibold", remainingSeconds <= 300 && "text-destructive")}>
              {formattedTime}
            </span>
          </div>
        </div>
        <div
          className="h-1 bg-muted"
          role="progressbar"
          aria-label="সময় বাকি"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(timeProgress)}
        >
          <div
            className={cn(
              "h-full transition-[width] duration-1000",
              remainingSeconds <= 300 ? "bg-destructive" : "bg-primary",
            )}
            style={{ width: `${timeProgress}%` }}
          />
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="flex shrink-0 items-center justify-between gap-3 py-3 sm:py-5">
          <div>
            <p className="text-sm font-semibold">
              প্রশ্ন {bn(activeIndex + 1)}{" "}
              <span className="font-normal text-muted-foreground">/ {bn(questions.length)}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{bn(answeredCount)}টি উত্তর দেওয়া হয়েছে</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setIsNavigatorOpen(true)}>
            <ListChecks aria-hidden="true" data-icon="inline-start" />
            প্রশ্ন তালিকা
          </Button>
        </div>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-card p-3 shadow-sm sm:p-7">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b pb-3 sm:mb-7 sm:pb-5">
            <span className="text-xs font-medium tracking-wide text-muted-foreground">
              প্রশ্ন {bn(activeIndex + 1)}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              ১ নম্বর
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 sm:py-6">
            <h1 className="mb-5 text-lg font-semibold leading-8 tracking-tight sm:mb-8 sm:text-xl sm:leading-9">
              {question.prompt}
            </h1>
            <fieldset className="flex flex-col gap-2.5 sm:gap-3">
              <legend className="sr-only">উত্তর বেছে নিন</legend>
              {question.options.map((option, index) => {
                const isSelected = answers[activeIndex] === index;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setAnswers((current) => ({ ...current, [activeIndex]: index }))}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-14 sm:px-4 sm:py-3 sm:text-base",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary text-foreground"
                        : "bg-background hover:bg-muted/60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground",
                      )}
                    >
                      {bn(index + 1)}
                    </span>
                    <span className="leading-6">{option}</span>
                    {isSelected ? <Check aria-hidden="true" className="ml-auto size-4 shrink-0 text-primary" /> : null}
                  </button>
                );
              })}
            </fieldset>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-2 border-t bg-card pt-3 sm:gap-3 sm:pt-5">
            <Button
              type="button"
              variant="outline"
              className="w-full px-2"
              onClick={() => moveTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="আগের প্রশ্ন"
            >
              <ArrowLeft aria-hidden="true" />
              <span>আগে</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full px-2"
              onClick={() => moveTo(activeIndex + 1)}
              disabled={activeIndex === questions.length - 1}
            >
              <Flag aria-hidden="true" />
              <span>বাদ দিন</span>
            </Button>
            {activeIndex === questions.length - 1 ? (
              <Button type="button" className="w-full px-2" onClick={() => setIsSubmitOpen(true)}>
                জমা দিন
              </Button>
            ) : (
              <Button type="button" className="w-full px-2" onClick={() => moveTo(activeIndex + 1)}>
                <span>পরের প্রশ্ন</span>
                <ArrowRight aria-hidden="true" />
              </Button>
            )}
          </div>
        </section>
      </div>

      {isNavigatorOpen ? (
        <Overlay onClose={() => setIsNavigatorOpen(false)} labelledBy="navigator-title">
          <div className="flex items-start justify-between gap-4 border-b p-4 sm:p-5">
            <div>
              <h2 id="navigator-title" className="font-semibold">
                প্রশ্ন তালিকা
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">উত্তর দেওয়া প্রশ্নে চাপ দিয়ে ফিরে যান।</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="তালিকা বন্ধ করুন"
              onClick={() => setIsNavigatorOpen(false)}
            >
              <X aria-hidden="true" />
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-2 overflow-y-auto p-4 sm:grid-cols-6 sm:p-5">
            {questions.map((item, index) => {
              const isAnswered = answers[index] !== undefined;
              const isCurrent = activeIndex === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`প্রশ্ন ${bn(index + 1)}${isAnswered ? ", উত্তর দেওয়া হয়েছে" : ", উত্তর বাকি"}`}
                  aria-current={isCurrent ? "step" : undefined}
                  onClick={() => moveTo(index)}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : isAnswered
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  {bn(index + 1)}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 border-t px-4 py-3 text-xs text-muted-foreground sm:px-5">
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2.5 rounded-full bg-primary" />
              উত্তর দেওয়া
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2.5 rounded-full border bg-background" />
              উত্তর বাকি
            </span>
          </div>
        </Overlay>
      ) : null}

      {isSubmitOpen ? (
        <Overlay onClose={() => setIsSubmitOpen(false)} labelledBy="submit-title">
          <div className="flex items-start justify-between gap-4 border-b p-4 sm:p-5">
            <div>
              <h2 id="submit-title" className="font-semibold">
                পরীক্ষা জমা দেবেন?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {bn(questions.length - answeredCount)}টি প্রশ্নের উত্তর বাকি।
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="বন্ধ করুন"
              onClick={() => setIsSubmitOpen(false)}
            >
              <X aria-hidden="true" />
            </Button>
          </div>
          <div className="flex gap-2 p-4 sm:justify-end sm:p-5">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => setIsSubmitOpen(false)}
            >
              ফিরে যান
            </Button>
            <Button type="button" className="flex-1 sm:flex-none" onClick={submitExam}>
              হ্যাঁ, জমা দিন
            </Button>
          </div>
        </Overlay>
      ) : null}
    </main>
  );
}

function Overlay({
  children,
  onClose,
  labelledBy,
}: {
  children: React.ReactNode;
  onClose: () => void;
  labelledBy: string;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-2xl border bg-background shadow-xl sm:rounded-2xl"
      >
        {children}
      </section>
    </div>
  );
}

function bn(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}
