"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthCard, FieldError } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { extractApiError } from "@/lib/api-error";
import { setSessionToken } from "@/lib/session-token";

// useSearchParams() opts the tree above it into client-side rendering, which
// Next.js requires wrapping in Suspense (build otherwise errors on
// "missing-suspense-with-csr-bailout").
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    if (!identifier.trim() || !password) {
      setError("Enter your username, phone, or email and your password");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.auth.login.$post({ json: { identifier, password } });
      if (!res.ok) {
        // Deliberately vague — never reveals which field was wrong (ADR-0020).
        const { message } = await extractApiError(res, "Incorrect username/phone/email or password");
        setError(message);
        return;
      }
      const { token } = await res.json();
      setSessionToken(token);
      router.push(searchParams.get("next") ?? "/dashboard");
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Log in">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="identifier">Username, phone, or email</Label>
          <Input
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <FieldError message={error} />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Logging in…" : "Log in"}
        </Button>

        <div className="flex flex-col gap-1 text-center text-sm text-muted-foreground">
          <Link href="/reset" className="text-primary underline-offset-4 hover:underline">
            Forgot your password?
          </Link>
          <p>
            New here?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
