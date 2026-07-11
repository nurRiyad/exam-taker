"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AuthCard, FieldError } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiClient } from "@/lib/api-client";
import { extractApiError, type FieldErrors } from "@/lib/api-error";
import { setSessionToken } from "@/lib/session-token";
import { validatePassword, validatePhone, validateUsername } from "@/lib/validation";

type AccountRole = "student" | "teacher";

type FormValues = {
  username: string;
  phone: string;
  role: AccountRole;
  password: string;
  passwordConfirmation: string;
};

const EMPTY_FORM: FormValues = {
  username: "",
  phone: "",
  role: "student",
  password: "",
  passwordConfirmation: "",
};

type Availability = "idle" | "checking" | "available" | "taken";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState<Availability>("idle");
  const usernameCheckTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Live username-availability check while typing (ADR-0049), debounced so we
  // don't fire one request per keystroke. Triggered from the input's own
  // change handler rather than an effect, since the check is a response to a
  // user action, not a value to keep synchronized with an external system.
  function handleUsernameChange(value: string) {
    update("username", value);
    clearTimeout(usernameCheckTimeout.current);

    if (validateUsername(value)) {
      setAvailability("idle");
      return;
    }
    setAvailability("checking");
    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await apiClient.auth["username-availability"].$get({ query: { username: value } });
        if (!res.ok) return setAvailability("idle");
        const data = await res.json();
        setAvailability(data.available ? "available" : "taken");
      } catch {
        setAvailability("idle");
      }
    }, 400);
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
    if (form.role !== "student" && form.role !== "teacher") errors.role = "Choose an account type";
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

    setSubmitting(true);
    try {
      const res = await apiClient.auth.signup.$post({ json: form });
      if (!res.ok) {
        const { message, fields } = await extractApiError(res, "Could not create your account.");
        setGeneralError(fields ? undefined : message);
        if (fields) setFieldErrors(fields);
        return;
      }
      const { token } = await res.json();
      setSessionToken(token);
      router.push("/dashboard");
    } catch {
      setGeneralError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
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

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">Account type</legend>
          <RadioGroup
            value={form.role}
            onValueChange={(value) => update("role", value as AccountRole)}
            className="grid grid-cols-2 gap-2"
          >
            {(["student", "teacher"] as const).map((role) => (
              <Label
                key={role}
                htmlFor={`role-${role}`}
                className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm has-data-[checked]:border-primary has-data-[checked]:bg-primary/5"
              >
                <RadioGroupItem
                  id={`role-${role}`}
                  value={role}
                  aria-invalid={Boolean(fieldErrors.role) || undefined}
                />
                <span className="capitalize">{role}</span>
              </Label>
            ))}
          </RadioGroup>
          <FieldError message={fieldErrors.role} />
        </fieldset>

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
