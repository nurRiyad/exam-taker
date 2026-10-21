"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard, FieldError } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignupMutation, useUsernameAvailabilityQuery } from "@/features/auth/queries";
import { type FieldErrors } from "@/utils/api-error";
import { setSessionToken } from "@/utils/session-token";
import { validatePassword, validatePhone, validateUsername } from "@/utils/validation";

type FormValues = {
  username: string;
  phone: string;
  role: "teacher";
  password: string;
  passwordConfirmation: string;
};

const EMPTY_FORM: FormValues = {
  username: "",
  phone: "",
  role: "teacher",
  password: "",
  passwordConfirmation: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>();
  const [usernameToCheck, setUsernameToCheck] = useState("");
  const usernameAvailability = useUsernameAvailabilityQuery(usernameToCheck, !!usernameToCheck);
  const signup = useSignupMutation();
  const submitting = signup.isPending;
  const availability = usernameAvailability.isFetching
    ? "checking"
    : usernameAvailability.data?.available
      ? "available"
      : usernameAvailability.data?.available === false
        ? "taken"
        : "idle";

  // Live username-availability check while typing, debounced so we
  // don't fire one request per keystroke. Triggered from the input's own
  // change handler rather than an effect, since the check is a response to a
  // user action, not a value to keep synchronized with an external system.
  function handleUsernameChange(value: string) {
    update("username", value);
    if (validateUsername(value)) {
      setUsernameToCheck("");
      return;
    }
    setUsernameToCheck(value);
  }

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    const usernameError = validateUsername(form.username);
    if (usernameError) errors.username = usernameError;
    else if (availability === "taken") errors.username = "Username is already taken";
    const phoneError = validatePhone(form.phone);
    if (phoneError) errors.phone = phoneError;
    const passwordError = validatePassword(form.password);
    if (passwordError) errors.password = passwordError;
    if (form.password !== form.passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    }
    return errors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setGeneralError(undefined);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    signup.reset();
    try {
      const { token } = await signup.mutateAsync(form);
      setSessionToken(token);
      const nextPath = new URLSearchParams(window.location.search).get("next");
      router.push(nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard");
    } catch (cause) {
      const error = cause as Error & { fields?: FieldErrors };
      setGeneralError(
        error.fields ? undefined : error.message || "Network error — check your connection and try again.",
      );
      if (error.fields) setFieldErrors(error.fields);
    }
  }

  return (
    <AuthCard title="Create your account" description="Use your profile settings later for name and email.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={form.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            autoComplete="username"
          />
          {!fieldErrors.username && availability === "checking" && (
            <p className="text-xs text-muted-foreground">Checking availability…</p>
          )}
          {!fieldErrors.username && availability === "available" && (
            <p className="text-xs text-emerald-600">Username is available</p>
          )}
          <FieldError message={fieldErrors.username} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            inputMode="numeric"
            placeholder="01712345678"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            autoComplete="tel"
          />
          <FieldError message={fieldErrors.phone} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            autoComplete="new-password"
          />
          <FieldError message={fieldErrors.password} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="passwordConfirmation">Confirm password</Label>
          <Input
            id="passwordConfirmation"
            type="password"
            value={form.passwordConfirmation}
            onChange={(e) => update("passwordConfirmation", e.target.value)}
            autoComplete="new-password"
          />
          <FieldError message={fieldErrors.passwordConfirmation} />
        </div>

        <FieldError message={generalError} />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating account…" : "Sign up"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
