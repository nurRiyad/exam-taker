import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, MapPin, School, UsersRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PublicTeacher } from "@/lib/public-directory-data";
import { getStorefrontBrand } from "./brand";
import { TeacherPageMasthead } from "./teacher-page-masthead";
import { getStorefrontTeacherCopy, getStorefrontTeacherSpecialty } from "./content";

export function TeacherStorefrontProfile({ teacher }: { teacher: PublicTeacher }) {
  const brand = getStorefrontBrand(teacher.id);
  const copy = getStorefrontTeacherCopy(teacher);

  return (
    <div
      className="flex min-h-screen flex-col bg-muted/30 text-foreground"
      style={{ "--teacher-accent": brand.accent, "--teacher-accent-soft": brand.accentSoft } as React.CSSProperties}
    >
      <TeacherPageMasthead teacher={teacher} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href={`/t/${teacher.id}`}
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          শিক্ষকের পেজে ফিরুন
        </Link>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="gap-4 p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--teacher-accent-soft)] text-xl font-bold text-[var(--teacher-accent)] sm:size-20 sm:text-2xl">
                  {brand.initials}
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="text-sm font-medium text-primary">শিক্ষক পরিচিতি</p>
                  <CardTitle className="text-2xl tracking-tight sm:text-3xl">{teacher.name}</CardTitle>
                  <p className="text-sm font-medium text-primary">{getStorefrontTeacherSpecialty(teacher)}</p>
                </div>
              </div>
              <Link href={`/t/${teacher.id}#courses`} className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
                কোর্স ও ব্যাচ দেখুন
              </Link>
            </div>
            <CardDescription className="max-w-4xl text-sm leading-7 sm:text-base">{copy.biography}</CardDescription>
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <School aria-hidden="true" className="size-4" />
                {teacher.institution}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4" />
                {getLocationLabel(teacher.location)}
              </span>
            </div>
          </CardHeader>
        </Card>

        <section aria-label="শিক্ষকের পরিসংখ্যান" className="grid gap-3 sm:grid-cols-3">
          <ProfileStat
            icon={<BookOpen aria-hidden="true" className="size-5" />}
            label="কোর্স"
            value={teacher.courseCount.toLocaleString("bn-BD")}
          />
          <ProfileStat
            icon={<UsersRound aria-hidden="true" className="size-5" />}
            label="শিক্ষার্থী"
            value={`${teacher.studentCount.toLocaleString("bn-BD")}+`}
          />
          <ProfileStat
            icon={<GraduationCap aria-hidden="true" className="size-5" />}
            label="পরীক্ষার ধরন"
            value={teacher.examCategories.length.toLocaleString("bn-BD")}
          />
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">পাঠদানের পদ্ধতি</CardTitle>
              <CardDescription>ক্লাস ও অনুশীলনে যে বিষয়গুলোতে গুরুত্ব দেওয়া হয়</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {teacher.teachingStyle.map((style) => (
                <span key={style} className="rounded-full border border-border bg-background px-3 py-1.5 text-sm">
                  {getTeachingStyleLabel(style)}
                </span>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">শিক্ষাগত যোগ্যতা</CardTitle>
              <CardDescription>শিক্ষক কর্তৃক যোগ করা তথ্য</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="rounded-lg bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                এই প্রোফাইলে শিক্ষাগত যোগ্যতার তথ্য এখনো যোগ করা হয়নি।
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="mt-auto border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            © {new Date().getFullYear()} {teacher.name}
          </span>
          <span>অনলাইন কোর্স ও পরীক্ষা</span>
        </div>
      </footer>
    </div>
  );
}

function ProfileStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          {icon}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="font-semibold">{value}</span>
        </span>
      </CardContent>
    </Card>
  );
}

function getLocationLabel(location: string) {
  const labels: Record<string, string> = {
    Dhaka: "ঢাকা",
    Chattogram: "চট্টগ্রাম",
    Rajshahi: "রাজশাহী",
    Sylhet: "সিলেট",
  };
  return labels[location] ?? location;
}

function getTeachingStyleLabel(style: string) {
  const labels: Record<string, string> = {
    "Shortcut drills": "শর্টকাট অনুশীলন",
    "Timed sets": "সময় ধরে অনুশীলন",
    "Pattern practice": "প্যাটার্ন চর্চা",
    "Grammar-first": "ব্যাকরণভিত্তিক পাঠ",
    "Weekly mocks": "সাপ্তাহিক মক পরীক্ষা",
    "Mistake review": "ভুলের পর্যালোচনা",
    "Topic maps": "বিষয়ভিত্তিক পাঠ",
    "Current updates": "সাম্প্রতিক তথ্য",
    "Fact revision": "তথ্য পুনরালোচনা",
    "Pattern recognition": "প্যাটার্ন শনাক্তকরণ",
    "Puzzle drills": "ধাঁধা অনুশীলন",
    "Weak-zone review": "দুর্বল বিষয় পর্যালোচনা",
  };
  return labels[style] ?? style;
}
