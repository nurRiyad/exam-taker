"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CourseBatch } from "@/lib/course-batches";
import { cn } from "@/lib/utils";

export function BatchEditorForm({ courseId, batch }: { courseId: string; batch?: CourseBatch }) {
  const [saved, setSaved] = useState(false);
  const [interval, setInterval] = useState(batch?.examIntervalDays ?? 7);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <header className="flex flex-col gap-2">
        <Link
          href={`/teacher/courses/${courseId}`}
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> কোর্সে ফিরুন
        </Link>
        <p className="text-sm font-medium text-primary">ব্যাচ সেটআপ</p>
        <h1 className="text-2xl font-semibold tracking-tight">{batch ? "ব্যাচের তথ্য সম্পাদনা" : "নতুন ব্যাচ তৈরি"}</h1>
        <p className="text-sm text-muted-foreground">
          এই ব্যাচের সিলেবাস, উপকরণ ও পরীক্ষার সময়সূচি অন্য ব্যাচ থেকে আলাদা থাকবে।
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>ব্যাচের পরিচিতি</CardTitle>
          <CardDescription>শিক্ষার্থীরা ব্যাচ বাছাই করার সময় এই তথ্য দেখবে।</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="batch-title">ব্যাচের নাম</Label>
            <Input
              id="batch-title"
              name="title"
              defaultValue={batch?.title}
              placeholder="যেমন: ব্যাংক নিয়োগ · অক্টোবর ব্যাচ"
              required
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="batch-description">সংক্ষিপ্ত পরিচিতি</Label>
            <textarea
              id="batch-description"
              name="description"
              defaultValue={batch?.description}
              placeholder="এই ব্যাচে কী প্রস্তুতি থাকবে?"
              required
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="batch-status">ভর্তি অবস্থা</Label>
            <select
              id="batch-status"
              name="status"
              defaultValue={batch?.status ?? "শিগগিরই"}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option>শিগগিরই</option>
              <option>চলমান</option>
              <option>শেষ</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="batch-students">আসন সংখ্যা</Label>
            <Input id="batch-students" name="capacity" type="number" min="1" defaultValue="500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>নিজস্ব পাঠ্যসূচি ও উপকরণ</CardTitle>
          <CardDescription>কোর্সের সাধারণ সিলেবাস থেকে আলাদা বিষয়গুলো লিখুন। প্রতি লাইনে একটি করে।</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="batch-syllabus">এই ব্যাচের পাঠ্যসূচি</Label>
            <textarea
              id="batch-syllabus"
              name="syllabus"
              defaultValue={batch?.syllabus.join("\n")}
              placeholder="শতকরা ও লাভ-ক্ষতি&#10;অনুপাত ও সমানুপাত&#10;সময় ও কাজ"
              required
              rows={4}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="batch-materials">শেখার উপকরণ</Label>
            <textarea
              id="batch-materials"
              name="materials"
              defaultValue={batch?.materials.join("\n")}
              placeholder="ব্যাংক গণিত সংক্ষিপ্ত নোট&#10;বিগত বছরের প্রশ্ন সংকলন"
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>পরীক্ষার সময়সূচি</CardTitle>
          <CardDescription>
            প্রথম পরীক্ষার তারিখ ও নিয়মিত ব্যবধান থেকে পরীক্ষার খসড়া তৈরি হবে। প্রতিটি তারিখ পরে আলাদাভাবে বদলানো যাবে।
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="first-exam-date">প্রথম পরীক্ষার তারিখ</Label>
            <Input
              id="first-exam-date"
              name="firstExamDate"
              type="date"
              defaultValue={batch?.firstExamDate ?? "2026-10-15"}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="exam-time">পরীক্ষার সময়</Label>
            <Input id="exam-time" name="examTime" defaultValue={batch?.examTime ?? "রাত ৮:০০"} required />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="exam-interval">পরীক্ষার মধ্যবর্তী দিন</Label>
            <div className="flex items-center gap-3">
              <Input
                id="exam-interval"
                name="examIntervalDays"
                type="number"
                min="1"
                max="90"
                value={interval}
                onChange={(event) => setInterval(Number(event.target.value))}
                className="max-w-32"
              />
              <span className="text-sm text-muted-foreground">দিন পরপর পরীক্ষা</span>
            </div>
            <p className="text-xs text-muted-foreground">প্রথম কয়েকটি পরীক্ষার ব্যবধান: {interval || 1} দিন</p>
          </div>
        </CardContent>
      </Card>

      {saved ? (
        <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
          ব্যাচের তথ্য সংরক্ষিত হয়েছে। (ডেমো—এই পরিবর্তন ব্রাউজার রিফ্রেশের পর থাকবে না।)
        </p>
      ) : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href={`/teacher/courses/${courseId}`} className={cn(buttonVariants({ variant: "outline" }))}>
          বাতিল
        </Link>
        <Button type="submit">
          <Save aria-hidden="true" data-icon="inline-start" /> তথ্য সংরক্ষণ
        </Button>
      </div>
    </form>
  );
}
