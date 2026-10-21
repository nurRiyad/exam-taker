"use client";

import { useState } from "react";
import { CheckIcon, ExternalLinkIcon, PencilIcon, XIcon } from "lucide-react";
import type { TeacherPublicProfileInput } from "@exam-taker/validation";
import { teacherPublicProfileSchema } from "@exam-taker/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useTeacherPublicProfileQuery,
  useUpdateTeacherPublicProfileMutation,
} from "@/features/profile/teacher-queries";

const SECTIONS: Array<{
  title: string;
  fields: Array<{ key: keyof TeacherPublicProfileInput; label: string; multiline?: boolean }>;
}> = [
  {
    title: "পরিচিতি",
    fields: [
      { key: "name", label: "প্রোফাইলে দেখানো নাম" },
      { key: "specialty", label: "বিশেষজ্ঞতা" },
      { key: "bio", label: "সংক্ষিপ্ত পরিচিতি", multiline: true },
    ],
  },
  {
    title: "শিক্ষক সম্পর্কে",
    fields: [
      { key: "description", label: "বিস্তারিত পরিচিতি", multiline: true },
      { key: "subject", label: "প্রধান পড়ানোর বিষয়" },
    ],
  },
  {
    title: "প্রতিষ্ঠান ও অবস্থান",
    fields: [
      { key: "institution", label: "প্রতিষ্ঠান" },
      { key: "location", label: "অবস্থান" },
    ],
  },
];

export function TeacherPublicProfileSettings() {
  const query = useTeacherPublicProfileQuery();
  const update = useUpdateTeacherPublicProfileMutation();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeacherPublicProfileInput | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof TeacherPublicProfileInput, string>>>({});
  const profile = query.data?.profile;

  if (query.isPending)
    return (
      <div role="status" className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        প্রোফাইল লোড হচ্ছে…
      </div>
    );
  if (query.isError || !profile)
    return (
      <section className="rounded-2xl border bg-card p-6">
        <p role="alert" className="text-sm text-destructive">
          প্রোফাইল আনা যায়নি। আবার চেষ্টা করুন।
        </p>
        <Button className="mt-4" variant="outline" onClick={() => query.refetch()}>
          আবার চেষ্টা করুন
        </Button>
      </section>
    );

  function beginEdit(title: string) {
    setDraft(teacherPublicProfileSchema.parse(profile));
    setErrors({});
    setEditing(title);
  }
  function setField(key: keyof TeacherPublicProfileInput, value: string) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !editing) return;
    const fields = SECTIONS.find((section) => section.title === editing)?.fields ?? [];
    const parsed = teacherPublicProfileSchema.safeParse(draft);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof TeacherPublicProfileInput;
        if (fields.some((item) => item.key === field)) next[field] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    try {
      await update.mutateAsync(parsed.data);
      setEditing(null);
      setDraft(null);
    } catch {
      /* Keep the draft available for retry. */
    }
  }

  return (
    <div className="space-y-4">
      <a
        href="/t/kafi"
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ExternalLinkIcon aria-hidden="true" className="size-4" /> পাবলিক প্রোফাইল দেখুন
        <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
      </a>
      {SECTIONS.map((section) => (
        <section key={section.title} className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">পাবলিক শিক্ষক পেজে প্রদর্শিত হবে</p>
            </div>
            {editing !== section.title ? (
              <Button variant="outline" className="shrink-0 gap-2" onClick={() => beginEdit(section.title)}>
                <PencilIcon /> সম্পাদনা
              </Button>
            ) : null}
          </div>
          {editing === section.title && draft ? (
            <form className="mt-5 space-y-4" onSubmit={save} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map(({ key, label, multiline }) => (
                  <div key={key} className={multiline ? "sm:col-span-2" : ""}>
                    <Label htmlFor={`teacher-profile-${key}`}>{label}</Label>
                    {multiline ? (
                      <textarea
                        id={`teacher-profile-${key}`}
                        className="mt-2 min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm"
                        value={draft[key]}
                        onChange={(event) => setField(key, event.target.value)}
                        aria-invalid={Boolean(errors[key])}
                      />
                    ) : (
                      <Input
                        id={`teacher-profile-${key}`}
                        className="mt-2 h-10"
                        value={draft[key]}
                        onChange={(event) => setField(key, event.target.value)}
                        aria-invalid={Boolean(errors[key])}
                      />
                    )}
                    {errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null}
                  </div>
                ))}
              </div>
              {update.isError ? (
                <p role="alert" className="text-sm text-destructive">
                  সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button type="submit" className="gap-2" disabled={update.isPending}>
                  <CheckIcon />
                  {update.isPending ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  disabled={update.isPending}
                  onClick={() => {
                    setEditing(null);
                    setDraft(null);
                  }}
                >
                  <XIcon />
                  বাতিল
                </Button>
              </div>
            </form>
          ) : (
            <dl className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {section.fields.map(({ key, label, multiline }) => (
                <div key={key} className={`border-t py-4 ${multiline ? "sm:col-span-2" : ""}`}>
                  <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">{profile[key] || "—"}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}
      {update.isSuccess && !editing ? (
        <p role="status" className="text-sm text-emerald-700">
          প্রোফাইলের তথ্য সংরক্ষণ হয়েছে।
        </p>
      ) : null}
    </div>
  );
}
