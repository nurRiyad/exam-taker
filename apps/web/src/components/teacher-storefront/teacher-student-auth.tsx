"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BookOpenCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PublicTeacher } from "@/lib/public-directory-data";
import { validatePassword, validatePhone, validateUsername } from "@/lib/validation";
import { getStorefrontBrand } from "./brand";
import { TeacherPageMasthead } from "./teacher-page-masthead";

type AuthMode = "login" | "signup";

export function TeacherStudentAuth({
  teacher,
  mode,
  nextPath,
}: {
  teacher: PublicTeacher;
  mode: AuthMode;
  nextPath?: string;
}) {
  const isSignup = mode === "signup";
  const brand = getStorefrontBrand(teacher.id);
  const [feedback, setFeedback] = useState("");
  const [fieldError, setFieldError] = useState("");
  const safeNextPath = nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : `/t/${teacher.id}`;
  const loginHref = makeAuthHref(`/t/${teacher.id}/login`, nextPath);
  const signupHref = makeAuthHref(`/t/${teacher.id}/signup`, nextPath);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get("identifier") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const username = String(formData.get("username") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const confirmation = String(formData.get("confirmation") ?? "");

    const validationError = isSignup
      ? (validateUsername(username) ??
        validatePhone(phone) ??
        validatePassword(password) ??
        (password !== confirmation ? "দুটি পাসওয়ার্ড মিলছে না।" : undefined))
      : !identifier || !password
        ? "ব্যবহারকারীর নাম/ফোন নম্বর ও পাসওয়ার্ড লিখুন।"
        : undefined;

    if (validationError) {
      setFieldError(validationError);
      setFeedback("");
      return;
    }

    setFieldError("");
    setFeedback("এই ডেমোতে অ্যাকাউন্ট সেবা এখনো চালু হয়নি—আপনার তথ্য জমা হয়নি।");
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-muted/30 text-foreground"
      style={{ "--teacher-accent": brand.accent, "--teacher-accent-soft": brand.accentSoft } as React.CSSProperties}
    >
      <TeacherPageMasthead teacher={teacher} showStudentLogin={false} />
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_26rem] lg:gap-14 lg:py-12">
        <section className="hidden flex-col gap-6 lg:flex">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <GraduationCap aria-hidden="true" className="size-7" />
          </span>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-primary">{teacher.institution}</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
              {isSignup ? `${teacher.name}-এর কোর্সে শেখা শুরু করুন` : `${teacher.name}-এর শিক্ষার্থী পোর্টালে স্বাগতম`}
            </h1>
            <p className="max-w-lg leading-7 text-muted-foreground">
              একটি শিক্ষার্থী অ্যাকাউন্ট দিয়ে এই শিক্ষকের কোর্সে ভর্তি, পরীক্ষা দেওয়া এবং নিজের অগ্রগতি দেখা যাবে।
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm">
            <p className="font-medium">শিক্ষার্থী অ্যাকাউন্টে যা পাবেন</p>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpenCheck aria-hidden="true" className="size-4 text-primary" />
              কোর্স ও ব্যাচের সব পরীক্ষা এক জায়গায়
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap aria-hidden="true" className="size-4 text-primary" />
              এই শিক্ষকের কোর্সের জন্য আলাদা শিক্ষার্থী অভিজ্ঞতা
            </span>
          </div>
        </section>

        <Card className="w-full shadow-md shadow-foreground/[0.04]">
          <CardHeader className="gap-2">
            <Link
              href={`/t/${teacher.id}`}
              className="mb-2 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              শিক্ষকের পেজে ফিরুন
            </Link>
            <p className="text-sm font-medium text-primary">{teacher.name} · শিক্ষার্থী অ্যাকাউন্ট</p>
            <CardTitle className="text-2xl">{isSignup ? "শিক্ষার্থী অ্যাকাউন্ট খুলুন" : "শিক্ষার্থী লগইন"}</CardTitle>
            <CardDescription>
              {isSignup
                ? "এই শিক্ষকের কোর্সে ভর্তি হতে আপনার অ্যাকাউন্ট তৈরি করুন।"
                : "এই শিক্ষকের কোর্স ও পরীক্ষায় যেতে লগইন করুন।"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              {isSignup ? (
                <>
                  <AuthField id="username" name="username" label="ব্যবহারকারীর নাম" autoComplete="username" required />
                  <AuthField
                    id="phone"
                    name="phone"
                    label="মোবাইল নম্বর"
                    type="tel"
                    inputMode="tel"
                    placeholder="০১৭১২৩৪৫৬৭৮"
                    autoComplete="tel"
                    required
                  />
                  <AuthField
                    id="password"
                    name="password"
                    label="পাসওয়ার্ড"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                  <AuthField
                    id="confirmation"
                    name="confirmation"
                    label="পাসওয়ার্ড নিশ্চিত করুন"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </>
              ) : (
                <>
                  <AuthField
                    id="identifier"
                    name="identifier"
                    label="ব্যবহারকারীর নাম বা ফোন নম্বর"
                    autoComplete="username"
                    required
                  />
                  <AuthField
                    id="password"
                    name="password"
                    label="পাসওয়ার্ড"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                  <Link
                    href={`/reset?next=${encodeURIComponent(safeNextPath)}`}
                    className="-mt-2 self-end text-sm text-primary underline-offset-4 hover:underline"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </Link>
                </>
              )}
              {fieldError ? (
                <p role="alert" className="text-sm text-destructive">
                  {fieldError}
                </p>
              ) : null}
              {feedback ? (
                <p
                  role="status"
                  className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground"
                >
                  {feedback}
                </p>
              ) : null}
              <Button type="submit" className="w-full">
                {isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
              </Button>
            </form>

            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 border-t" />
              <span className="relative bg-card px-3 text-xs text-muted-foreground">অথবা</span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setFieldError("");
                setFeedback("Google দিয়ে প্রবেশের সুবিধা এখনো চালু হয়নি।");
              }}
            >
              <GoogleMark />
              Google দিয়ে {isSignup ? "অ্যাকাউন্ট খুলুন" : "লগইন করুন"}
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t text-sm text-muted-foreground">
            {isSignup ? (
              <>
                আগে থেকেই অ্যাকাউন্ট আছে?{" "}
                <Link href={loginHref} className="ml-1 font-medium text-primary underline-offset-4 hover:underline">
                  লগইন করুন
                </Link>
              </>
            ) : (
              <>
                নতুন শিক্ষার্থী?{" "}
                <Link href={signupHref} className="ml-1 font-medium text-primary underline-offset-4 hover:underline">
                  অ্যাকাউন্ট খুলুন
                </Link>
              </>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

function AuthField({
  id,
  name,
  label,
  type = "text",
  ...props
}: React.ComponentProps<typeof Input> & { id: string; name: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} className="h-10 bg-background" {...props} />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-4" data-icon="inline-start">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.93c-.58 2.96-2.25 5.48-4.72 7.18l7.62 5.91c4.45-4.11 7.15-10.16 7.15-17.56Z"
      />
      <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.42-4.83 2.25-8.28 2.25-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

function makeAuthHref(path: string, nextPath?: string) {
  return nextPath ? `${path}?next=${encodeURIComponent(nextPath)}` : path;
}
