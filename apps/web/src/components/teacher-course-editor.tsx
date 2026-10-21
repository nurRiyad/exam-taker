"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { createCourseSchema, type CreateCourseInput } from "@exam-taker/validation/courses";
import type { TeacherCourse } from "@/features/courses/api";
import { useCreateTeacherCourseMutation, useUpdateTeacherCourseMutation } from "@/features/courses/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EMPTY: CreateCourseInput = {
  title: "",
  shortDescription: "",
  fullSyllabus: "",
  basePriceBdt: 0,
  isFree: false,
  status: "draft",
};

export function TeacherCourseEditor({ course }: { course?: TeacherCourse }) {
  const router = useRouter();
  const [draft, setDraft] = useState<CreateCourseInput>(() =>
    course
      ? {
          title: course.title,
          shortDescription: course.shortDescription ?? "",
          fullSyllabus: course.fullSyllabus ?? "",
          basePriceBdt: course.basePriceBdt,
          isFree: course.isFree,
          status: course.status === "published" ? "published" : "draft",
          discountPercent: course.discountPercent ?? undefined,
          discountStartAt: course.discountStartAt ? new Date(course.discountStartAt) : undefined,
          discountEndAt: course.discountEndAt ? new Date(course.discountEndAt) : undefined,
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CreateCourseInput, string>>>({});
  const create = useCreateTeacherCourseMutation();
  const update = useUpdateTeacherCourseMutation();
  const mutation = course ? update : create;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createCourseSchema.safeParse(draft);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof CreateCourseInput;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    try {
      if (course) await update.mutateAsync({ id: course.id, input: parsed.data });
      else await create.mutateAsync(parsed.data);
      router.push("/teacher/courses");
    } catch {
      // The mutation error is shown below and the draft stays available for retry.
    }
  }

  function setField<K extends keyof CreateCourseInput>(key: K, value: CreateCourseInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  return (
    <form onSubmit={save} noValidate className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header className="flex flex-col gap-2">
        <Link href="/teacher/courses" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" />
          আমার কোর্সে ফিরুন
        </Link>
        <p className="text-sm font-medium text-primary">শিক্ষক ড্যাশবোর্ড</p>
        <h1 className="text-2xl font-semibold tracking-tight">{course ? "কোর্স সম্পাদনা" : "নতুন কোর্স"}</h1>
      </header>
      <section className="grid gap-4 rounded-2xl border bg-card p-5 sm:p-6">
        <Field label="কোর্সের নাম" error={errors.title}>
          <Input
            value={draft.title}
            onChange={(event) => setField("title", event.target.value)}
            aria-invalid={Boolean(errors.title)}
          />
        </Field>
        <Field label="কোর্স পরিচিতি" error={errors.shortDescription}>
          <textarea
            rows={4}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={draft.shortDescription}
            onChange={(event) => setField("shortDescription", event.target.value)}
            aria-invalid={Boolean(errors.shortDescription)}
          />
        </Field>
        <Field label="সাধারণ পাঠ্যসূচি" error={errors.fullSyllabus}>
          <textarea
            rows={4}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={draft.fullSyllabus}
            onChange={(event) => setField("fullSyllabus", event.target.value)}
            aria-invalid={Boolean(errors.fullSyllabus)}
          />
        </Field>
        {course ? (
          <Field label="কোর্সের অবস্থা">
            <Select value={draft.status} onValueChange={(value) => setField("status", value as "draft" | "published")}>
              <SelectTrigger aria-label="কোর্সের অবস্থা">
                <SelectValue>{draft.status === "published" ? "প্রকাশিত" : "খসড়া"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="draft">খসড়া</SelectItem>
                  <SelectItem value="published">প্রকাশিত</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.isFree}
            onChange={(event) => setField("isFree", event.target.checked)}
          />
          কোর্সটি বিনামূল্যে
        </label>
        {!draft.isFree ? (
          <Field label="মূল্য (টাকা)" error={errors.basePriceBdt}>
            <Input
              type="number"
              min="0"
              value={draft.basePriceBdt}
              onChange={(event) => setField("basePriceBdt", Number(event.target.value))}
              aria-invalid={Boolean(errors.basePriceBdt)}
            />
          </Field>
        ) : null}
        {mutation.isError ? (
          <p role="alert" className="text-sm text-destructive">
            সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।
          </p>
        ) : null}
        <div className="border-t pt-4">
          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            <Save />
            {mutation.isPending ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ করুন"}
          </Button>
        </div>
      </section>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </label>
  );
}
