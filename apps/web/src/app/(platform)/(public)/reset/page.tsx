"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard, FieldError } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { extractApiError, type FieldErrors } from "@/lib/api-error";
import { validatePassword } from "@/lib/validation";

type FormValues = {
  identifier: string;
  code: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

const EMPTY_FORM: FormValues = { identifier: "", code: "", newPassword: "", newPasswordConfirmation: "" };

export default function ResetPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.identifier.trim()) errors.identifier = "Enter your username or phone";
    if (form.code.length !== 6) errors.code = "Enter the 6-digit reset code";
    const passwordError = validatePassword(form.newPassword);
    if (passwordError) errors.newPassword = passwordError;
    if (form.newPassword !== form.newPasswordConfirmation) {
      errors.newPasswordConfirmation = "Passwords do not match";
    }
    return errors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setGeneralError(undefined);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await apiClient.auth.reset.$post({ json: form });
      if (!res.ok) {
        // Deliberately vague — mirrors login's "don't confirm which identifiers exist" rule.
        const { message } = await extractApiError(res, "Invalid or expired reset code");
        setGeneralError(message);
        return;
      }
      router.push("/login");
    } catch {
      setGeneralError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Reset your password" description="Enter the code your teacher or admin gave you.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="identifier">Username or phone</Label>
          <Input
            id="identifier"
            value={form.identifier}
            onChange={(e) => update("identifier", e.target.value)}
            autoComplete="username"
          />
          <FieldError message={fieldErrors.identifier} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="code">Reset code</Label>
          <Input
            id="code"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={form.code}
            onChange={(e) => update("code", e.target.value)}
          />
          <FieldError message={fieldErrors.code} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            value={form.newPassword}
            onChange={(e) => update("newPassword", e.target.value)}
            autoComplete="new-password"
          />
          <FieldError message={fieldErrors.newPassword} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="newPasswordConfirmation">Confirm new password</Label>
          <Input
            id="newPasswordConfirmation"
            type="password"
            value={form.newPasswordConfirmation}
            onChange={(e) => update("newPasswordConfirmation", e.target.value)}
            autoComplete="new-password"
          />
          <FieldError message={fieldErrors.newPasswordConfirmation} />
        </div>

        <FieldError message={generalError} />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Resetting…" : "Reset password"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
