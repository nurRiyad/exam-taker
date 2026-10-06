"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, UsersRound } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CourseBatch } from "@/lib/course-batches";
import { formatBanglaDate, getBatchExams } from "@/lib/course-batches";
import { cn } from "@/lib/utils";

export function BatchJoinPanel({
  courseId,
  batches,
  selectedBatchId,
}: {
  courseId: string;
  batches: CourseBatch[];
  selectedBatchId?: string;
}) {
  const [selected, setSelected] = useState(
    batches.some((batch) => batch.id === selectedBatchId) ? selectedBatchId! : (batches[0]?.id ?? ""),
  );
  const [joined, setJoined] = useState(false);
  const batch = batches.find((item) => item.id === selected);
  if (!batches.length)
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          এখন কোনো ব্যাচে ভর্তি নেওয়া হচ্ছে না।
        </CardContent>
      </Card>
    );

  if (joined && batch)
    return (
      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CheckCircle2 aria-hidden="true" className="size-8 text-primary" />
          <CardTitle>ব্যাচে ভর্তি সম্পন্ন</CardTitle>
          <CardDescription>{batch.title} এখন আপনার কোর্স তালিকায় যুক্ত হয়েছে।</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/student/courses/${courseId}/batches/${batch.id}`} className={cn(buttonVariants(), "w-full")}>
            ব্যাচে যান
          </Link>
        </CardContent>
      </Card>
    );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ব্যাচ বেছে নিন</h1>
        <p className="text-sm text-muted-foreground">প্রতিটি ব্যাচের সিলেবাস ও পরীক্ষার সূচি আলাদা।</p>
      </div>
      <RadioGroup
        value={selected}
        onValueChange={(value) => setSelected(String(value))}
        aria-label="ভর্তির জন্য ব্যাচ নির্বাচন"
        className="gap-3"
      >
        {batches.map((item) => {
          const nextExam = getBatchExams(item).find((exam) => !exam.isPast) ?? getBatchExams(item)[0];
          const active = selected === item.id;
          return (
            <Label
              key={item.id}
              htmlFor={`join-batch-${item.id}`}
              className="block cursor-pointer rounded-xl outline-none"
            >
              <Card
                className={cn(
                  "gap-0 transition-colors",
                  active && "border-primary/40 bg-primary/5 ring-1 ring-primary/20",
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="mt-1 leading-5">{item.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs">{item.status}</span>
                      <RadioGroupItem id={`join-batch-${item.id}`} value={item.id} aria-label={item.title} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <UsersRound aria-hidden="true" className="size-3.5" />
                    {item.studentCount.toLocaleString("bn-BD")} জন
                  </span>
                  <span>পরবর্তী পরীক্ষা: {formatBanglaDate(nextExam.date)}</span>
                  <span>{item.syllabus.length}টি সিলেবাস টপিক</span>
                </CardContent>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>
      {batch ? (
        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={() => setJoined(true)}>
            এই ব্যাচে ভর্তি হোন
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {batch.title} · পরীক্ষাগুলো {batch.examIntervalDays} দিন পরপর
          </p>
        </div>
      ) : null}
    </div>
  );
}
