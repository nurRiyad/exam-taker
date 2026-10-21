import Link from "next/link";
import { BookOpen, GraduationCap, Users, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBatches } from "@/utils/course-batches";
import { PUBLIC_COURSES_DIRECTORY, PUBLIC_TEACHERS } from "@/utils/public-directory-data";

const metrics = [
  { label: "শিক্ষক", value: PUBLIC_TEACHERS.length, icon: GraduationCap, href: "/teachers" },
  { label: "কোর্স", value: PUBLIC_COURSES_DIRECTORY.length, icon: BookOpen, href: "/courses" },
  {
    label: "ব্যাচ",
    value: PUBLIC_COURSES_DIRECTORY.reduce((total, course) => total + getCourseBatches(course.id).length, 0),
    icon: UsersRound,
  },
  {
    label: "শিক্ষার্থী",
    value: PUBLIC_COURSES_DIRECTORY.reduce(
      (total, course) =>
        total + getCourseBatches(course.id).reduce((batchTotal, batch) => batchTotal + batch.studentCount, 0),
      0,
    ),
    icon: Users,
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary">অ্যাডমিন</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">ড্যাশবোর্ড</h1>
        <p className="text-sm text-muted-foreground">প্ল্যাটফর্মের সংক্ষিপ্ত পরিসংখ্যান।</p>
      </header>

      <section aria-label="প্ল্যাটফর্মের পরিসংখ্যান" className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {metrics.map(({ label, value, icon: Icon, href }) => {
          const card = (
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-sm text-muted-foreground">মোট {label}</CardTitle>
                <Icon aria-hidden="true" className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">{value.toLocaleString("bn-BD")}</p>
              </CardContent>
            </Card>
          );

          return href ? (
            <Link
              key={label}
              href={href}
              className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </section>
    </main>
  );
}
