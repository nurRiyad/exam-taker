"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthCard, FieldError } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/features/auth/queries";
import { setSessionToken } from "@/utils/session-token";

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
  const searchParams = useSearchParams();
  const signupNextPath = searchParams.get("next");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const login = useLoginMutation();
  const submitting = login.isPending;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
    login.reset();
    if (!identifier.trim() || !password) {
      setError("ইমেইল বা ফোন নম্বর এবং পাসওয়ার্ড লিখুন");
      return;
    }

    try {
      const { token } = await login.mutateAsync({ identifier, password });
      setSessionToken(token);
      window.location.assign("/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  }

  return (
    <AuthCard title="লগইন করুন">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="identifier">ইমেইল বা ফোন নম্বর</Label>
          <Input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">পাসওয়ার্ড</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <FieldError message={error} />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "লগইন হচ্ছে…" : "লগইন করুন"}
        </Button>

        <div className="flex flex-col gap-1 text-center text-sm text-muted-foreground">
          <Link href="/reset" className="text-primary underline-offset-4 hover:underline">
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
          <p>
            নতুন ব্যবহারকারী?{" "}
            <Link
              href={signupNextPath ? `/signup?next=${encodeURIComponent(signupNextPath)}` : "/signup"}
              className="text-primary underline-offset-4 hover:underline"
            >
              অ্যাকাউন্ট খুলুন
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
