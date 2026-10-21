"use client";

import { useState } from "react";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import type { ProfileInput } from "@exam-taker/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfileQuery, useUpdateProfileMutation } from "@/features/profile/queries";
import { profileSchema } from "@exam-taker/validation";

const DIVISIONS = ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"];

export function AccountSettings() {
  const profileQuery = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileInput | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProfileInput, string>>>({});
  const profile = profileQuery.data?.profile;
  const form = editing ? (draft ?? profile) : profile;

  function setField(field: keyof ProfileInput, value: string) {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      const errors: Partial<Record<keyof ProfileInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ProfileInput;
        errors[field] ??= issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    try {
      await updateProfile.mutateAsync(parsed.data);
      setEditing(false);
    } catch {
      // Mutation error is announced below; keep the entered values for retry.
    }
  }

  if (profileQuery.isPending) {
    return (
      <div role="status" className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        প্রোফাইল লোড হচ্ছে…
      </div>
    );
  }
  if (profileQuery.isError || !profile || !form) {
    return (
      <section className="rounded-2xl border bg-card p-6">
        <p role="alert" className="text-sm text-destructive">
          প্রোফাইল আনা যায়নি। আবার চেষ্টা করুন।
        </p>
        <Button className="mt-4" variant="outline" onClick={() => profileQuery.refetch()}>
          আবার চেষ্টা করুন
        </Button>
      </section>
    );
  }

  const fields: Array<{ key: keyof ProfileInput; label: string; type?: string }> = [
    { key: "fullName", label: "পূর্ণ নাম" },
    { key: "phone", label: "ফোন নম্বর", type: "tel" },
    { key: "division", label: "বিভাগ" },
    { key: "district", label: "জেলা" },
    { key: "address", label: "সম্পূর্ণ ঠিকানা" },
  ];

  return (
    <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">ব্যক্তিগত তথ্য</h2>
          <p className="mt-1 text-sm text-muted-foreground">আপনার প্রোফাইলের যোগাযোগ ও ঠিকানার তথ্য।</p>
        </div>
        {!editing ? (
          <Button
            variant="outline"
            className="shrink-0 gap-2"
            onClick={() => {
              setDraft(profile);
              setEditing(true);
            }}
          >
            <PencilIcon /> সম্পাদনা
          </Button>
        ) : null}
      </div>

      {editing ? (
        <form className="mt-6 space-y-5" onSubmit={save} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ key, label, type }) => (
              <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                <Label htmlFor={`profile-${key}`}>{label}</Label>
                {key === "division" ? (
                  <Select
                    items={[
                      { value: "", label: "বিভাগ নির্বাচন করুন" },
                      ...DIVISIONS.map((division) => ({ value: division, label: division })),
                    ]}
                    value={form[key]}
                    onValueChange={(value: string | null) => setField(key, value ?? "")}
                  >
                    <SelectTrigger id={`profile-${key}`} className="mt-2 h-10" aria-invalid={Boolean(fieldErrors[key])}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="">বিভাগ নির্বাচন করুন</SelectItem>
                        {DIVISIONS.map((division) => (
                          <SelectItem key={division} value={division}>
                            {division}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={`profile-${key}`}
                    type={type ?? "text"}
                    value={form[key]}
                    onChange={(event) => setField(key, event.target.value)}
                    aria-invalid={Boolean(fieldErrors[key])}
                    className="mt-2 h-10"
                  />
                )}
                {fieldErrors[key] ? <p className="mt-1.5 text-xs text-destructive">{fieldErrors[key]}</p> : null}
              </div>
            ))}
          </div>
          {updateProfile.isError ? (
            <p role="alert" className="text-sm text-destructive">
              তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button type="submit" disabled={updateProfile.isPending} className="gap-2">
              <CheckIcon /> {updateProfile.isPending ? "সংরক্ষণ হচ্ছে…" : "পরিবর্তন সংরক্ষণ"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={updateProfile.isPending}
              className="gap-2"
              onClick={() => {
                setDraft(profileQuery.data.profile);
                setFieldErrors({});
                setEditing(false);
              }}
            >
              <XIcon /> বাতিল
            </Button>
          </div>
        </form>
      ) : (
        <dl className="mt-6 grid gap-x-8 sm:grid-cols-2">
          {fields.map(({ key, label }) => (
            <div key={key} className="border-t py-4 first:border-t-0 sm:odd:border-t-0">
              <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
              <dd className="mt-1 break-words text-sm font-medium">{form[key] || "—"}</dd>
            </div>
          ))}
          {updateProfile.isSuccess ? (
            <p role="status" className="mt-3 text-sm text-emerald-700 sm:col-span-2">
              তথ্য সংরক্ষণ হয়েছে।
            </p>
          ) : null}
        </dl>
      )}
    </section>
  );
}
