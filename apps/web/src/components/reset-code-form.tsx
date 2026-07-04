"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { extractApiError } from "@/lib/api-error";
import { FieldError } from "@/components/auth-card";

// Shared by the teacher and admin reset-codes pages (ADR-0025). No student
// lookup UI yet — that arrives in Step 12; for now the caller pastes the
// student's user ID directly.
export function ResetCodeForm() {
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState<string>();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    setCode(undefined);
    if (!userId.trim()) {
      setError("Enter the student's user ID");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.auth["reset-codes"].$post({ json: { userId: userId.trim() } });
      if (!res.ok) {
        const { message } = await extractApiError(res, "Could not generate a reset code.");
        setError(message);
        return;
      }
      const data = await res.json();
      setCode(data.code);
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="userId">Student user ID</Label>
        <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <FieldError message={error} />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Generating…" : "Generate reset code"}
      </Button>

      {code ? (
        <div className="rounded-lg border bg-muted/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Deliver this code to the student yourself (WhatsApp, phone). It won&apos;t be shown again.
          </p>
          <p className="mt-1 select-all font-mono text-2xl font-semibold tracking-widest">{code}</p>
        </div>
      ) : null}
    </form>
  );
}
