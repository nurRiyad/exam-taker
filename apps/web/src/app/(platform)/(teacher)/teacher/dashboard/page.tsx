import { BookOpen, ClipboardCheck, UsersRound, UserRoundPlus } from "lucide-react";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { getCourseBatches, getTeacherCourses } from "@/utils/course-batches";
import { getTeacherAccessRequests } from "@/utils/teacher-access-requests";

const TEACHER_ID = "kafi";

export default function TeacherDashboardPage() {
  const courses = getTeacherCourses(TEACHER_ID);
  const batches = courses.flatMap((course) => getCourseBatches(course.id));
  const studentTotal = batches.reduce((total, batch) => total + batch.studentCount, 0);
  const requests = getTeacherAccessRequests(TEACHER_ID);
  const pendingJoinRequestCount = requests.length;
  const stats = [
    { label: "মোট কোর্স", value: courses.length, icon: BookOpen, tint: "bg-violet-50 text-violet-700" },
    { label: "মোট ব্যাচ", value: batches.length, icon: ClipboardCheck, tint: "bg-blue-50 text-blue-700" },
    { label: "মোট শিক্ষার্থী", value: studentTotal, icon: UsersRound, tint: "bg-emerald-50 text-emerald-700" },
    {
      label: "যোগদানের অনুরোধ",
      value: pendingJoinRequestCount,
      icon: UserRoundPlus,
      tint: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-7 px-4 py-7 sm:px-6 sm:py-9">
      <header>
        <p className="text-sm font-medium text-primary">শিক্ষক ওভারভিউ</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">ড্যাশবোর্ড</h1>
      </header>

      <section aria-label="শিক্ষক অ্যাকাউন্টের সারসংক্ষেপ" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <>
              <span className={`mb-3 flex size-9 items-center justify-center rounded-xl ${stat.tint}`}>
                <Icon className="size-[18px]" />
              </span>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{stat.value.toLocaleString("bn-BD")}</p>
            </>
          );

          return (
            <article key={stat.label} className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
              {content}
            </article>
          );
        })}
      </section>

      <TeacherDashboard initialRequests={requests} />
    </main>
  );
}
