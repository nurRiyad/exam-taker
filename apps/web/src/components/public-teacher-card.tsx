import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicTeacher } from "@/lib/public-directory-data";

function formatCount(count: number) {
  return new Intl.NumberFormat("bn-BD").format(count);
}

export function PublicTeacherCard({ teacher }: { teacher: PublicTeacher }) {
  return (
    <Link
      href={`/teachers/${teacher.id}`}
      aria-label={`${teacher.name} — প্রোফাইল দেখুন`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full gap-3 border border-border/70 p-4 shadow-sm shadow-indigo-950/[0.025] transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md group-hover:shadow-indigo-950/[0.06] group-focus-visible:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-0">
          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle className="truncate text-base font-semibold">{teacher.name}</CardTitle>
            <p className="line-clamp-1 text-xs text-muted-foreground">{teacher.specialty}</p>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-100 text-sm font-semibold text-indigo-700 ring-1 ring-sky-100">
            {teacher.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 p-0">
          <div className="flex flex-wrap gap-1.5">
            {teacher.examCategories.map((category) => (
              <span
                key={category}
                className="rounded-md bg-secondary/80 px-2 py-1 text-xs font-medium text-secondary-foreground"
              >
                {category === "Govt Job" ? "সরকারি চাকরি" : category === "Bank" ? "ব্যাংক" : category}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-border/70 pt-3 text-xs">
            <span className="font-medium">{formatCount(teacher.studentCount)} শিক্ষার্থী</span>
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <span className="text-muted-foreground">{teacher.courseCount.toLocaleString("bn-BD")}টি কোর্স</span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 font-medium text-primary">
              প্রোফাইল{" "}
              <ArrowUpRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
