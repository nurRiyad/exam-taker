"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, ClipboardList, Clock3, Pencil, Plus, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/utils";

type McqQuestion = { id: string; prompt: string; options: [string, string, string, string]; answer: number };
type QuestionDraft = Omit<McqQuestion, "id">;

function getSeedQuestions(examTitle: string, topic: string): McqQuestion[] {
  return [
    {
      id: "demo-q1",
      prompt: "৪০০ টাকার ২৫% কত?",
      options: ["৮০ টাকা", "৯০ টাকা", "১০০ টাকা", "১২০ টাকা"],
      answer: 2,
    },
    {
      id: "demo-q2",
      prompt: "৩ : ৫ অনুপাতের দুটি সংখ্যার যোগফল ৬৪ হলে বড় সংখ্যাটি কত?",
      options: ["২৪", "৩২", "৪০", "৪৮"],
      answer: 2,
    },
    {
      id: "demo-q3",
      prompt: `${topic} অনুশীলন · ${examTitle}: ০.২৫ কে সাধারণ ভগ্নাংশে প্রকাশ করলে কোনটি হবে?`,
      options: ["১/২", "১/৩", "১/৪", "৩/৪"],
      answer: 2,
    },
  ];
}

export function TeacherExamQuestions({
  courseId,
  batchId,
  examId,
  examTitle,
  topic,
  batchTitle,
  examDate,
  examTime,
  questionCount,
  durationMinutes,
}: {
  courseId: string;
  batchId: string;
  examId: string;
  examTitle: string;
  topic: string;
  batchTitle: string;
  examDate: string;
  examTime: string;
  questionCount: number;
  durationMinutes: number;
}) {
  const [questions, setQuestions] = useState(() => getSeedQuestions(examTitle, topic));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draft, setDraft] = useState<QuestionDraft>({ prompt: "", options: ["", "", "", ""], answer: 0 });
  const [saved, setSaved] = useState(false);

  function startAdd() {
    setEditingId(null);
    setDraft({ prompt: "", options: ["", "", "", ""], answer: 0 });
    setIsFormOpen(true);
    setSaved(false);
  }

  function startEdit(question: McqQuestion) {
    setEditingId(question.id);
    setDraft({ prompt: question.prompt, options: [...question.options], answer: question.answer });
    setIsFormOpen(true);
    setSaved(false);
  }

  function saveQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId) {
      setQuestions((current) =>
        current.map((question) => (question.id === editingId ? { ...question, ...draft } : question)),
      );
    } else {
      setQuestions((current) => [...current, { id: `question-${Date.now()}`, ...draft }]);
    }
    setIsFormOpen(false);
    setSaved(true);
  }

  function setOption(index: number, value: string) {
    setDraft((current) => {
      const options: QuestionDraft["options"] = [...current.options];
      options[index] = value;
      return { ...current, options };
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-7 sm:px-6 sm:py-9">
      <Link
        href={`/teacher/courses/${courseId}/batches/${batchId}`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> ব্যাচে ফিরুন
      </Link>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              {batchTitle}
            </p>
            <CardTitle className="text-xl sm:text-2xl">{examTitle}</CardTitle>
            <CardDescription>{topic}</CardDescription>
          </div>
          <Link
            href={`/teacher/courses/${courseId}/batches/${batchId}/exams/${examId}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
          >
            <Pencil data-icon="inline-start" /> পরীক্ষা সম্পাদনা
          </Link>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-4" />
            {examDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 aria-hidden="true" className="size-4" />
            {examTime} · {durationMinutes.toLocaleString("bn-BD")} মিনিট
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClipboardList aria-hidden="true" className="size-4" />
            {questionCount.toLocaleString("bn-BD")}টি প্রশ্ন
          </span>
        </CardContent>
      </Card>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">MCQ প্রশ্ন</h1>
          <p className="mt-1 text-sm text-muted-foreground">{questions.length.toLocaleString("bn-BD")}টি প্রশ্ন</p>
        </div>
        <Button type="button" onClick={startAdd} className="shrink-0">
          <Plus data-icon="inline-start" /> প্রশ্ন যোগ
        </Button>
      </header>

      {saved ? (
        <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
          প্রশ্নের পরিবর্তন সংরক্ষিত হয়েছে। (ডেমো—রিফ্রেশের পর থাকবে না।)
        </p>
      ) : null}

      {isFormOpen ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "প্রশ্ন সম্পাদনা" : "নতুন MCQ প্রশ্ন"}</CardTitle>
            <CardDescription>প্রশ্ন, চারটি বিকল্প এবং সঠিক উত্তর দিন।</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveQuestion} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mcq-prompt">প্রশ্ন</Label>
                <textarea
                  id="mcq-prompt"
                  value={draft.prompt}
                  onChange={(event) => setDraft((current) => ({ ...current, prompt: event.target.value }))}
                  rows={3}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <fieldset className="grid gap-3">
                <legend className="mb-1 text-sm font-medium">বিকল্প ও সঠিক উত্তর</legend>
                {draft.options.map((option, index) => (
                  <div key={index} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                    <label
                      className="flex size-9 cursor-pointer items-center justify-center rounded-lg border text-sm"
                      aria-label={`বিকল্প ${index + 1} সঠিক উত্তর হিসেবে বাছুন`}
                    >
                      <input
                        type="radio"
                        name="correct-answer"
                        value={index}
                        checked={draft.answer === index}
                        onChange={() => setDraft((current) => ({ ...current, answer: index }))}
                        required
                        className="accent-primary"
                      />
                    </label>
                    <Input
                      aria-label={`বিকল্প ${index + 1}`}
                      value={option}
                      onChange={(event) => setOption(index, event.target.value)}
                      placeholder={`বিকল্প ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </fieldset>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit">
                  <Save data-icon="inline-start" /> সংরক্ষণ
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {questions.length ? (
        <section aria-label="MCQ প্রশ্নের তালিকা" className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <CardDescription>প্রশ্ন {index + 1}</CardDescription>
                  <CardTitle className="mt-1 text-base leading-6">{question.prompt}</CardTitle>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(question)}>
                  <Pencil data-icon="inline-start" /> সম্পাদনা
                </Button>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={`${question.id}-${optionIndex}`}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm",
                      optionIndex === question.answer ? "border-primary/30 bg-primary/5 font-medium" : "bg-background",
                    )}
                  >
                    <span className="mr-2 text-muted-foreground">{["ক", "খ", "গ", "ঘ"][optionIndex]}.</span>
                    {option}
                    {optionIndex === question.answer ? (
                      <Check className="ml-2 inline size-4 text-primary" aria-label="সঠিক উত্তর" />
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            এখনো কোনো প্রশ্ন যোগ করা হয়নি।
          </CardContent>
        </Card>
      )}
    </main>
  );
}
