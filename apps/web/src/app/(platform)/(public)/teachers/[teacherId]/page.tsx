import { notFound } from "next/navigation";
import { TeacherProfileCourses } from "@/components/teacher-profile-courses";
import { getCoursesByTeacher, getExamCategoryLabel, getPublicTeacher } from "@/lib/public-directory-data";

type TeacherDetailsPageProps = {
  params: Promise<{ teacherId: string }>;
};

export default async function TeacherDetailsPage({ params }: TeacherDetailsPageProps) {
  const { teacherId } = await params;
  const teacher = getPublicTeacher(teacherId);

  if (!teacher) notFound();

  const courses = getCoursesByTeacher(teacher.id);
  const teacherName = teacher.id === "mahbub-hasan" ? "মাহবুব হাসান" : teacher.name;
  const subjectLabel = teacher.subject === "Mathematics" ? "গণিত" : teacher.subject;
  const locationLabel = teacher.location === "Chattogram" ? "চট্টগ্রাম" : teacher.location;
  const institutionLabel = teacher.institution === "Exam Focus Academy" ? "এক্সাম ফোকাস একাডেমি" : teacher.institution;
  const specialtyLabel = teacher.id === "mahbub-hasan" ? "সময় বাঁচানোর গণিত কৌশল" : teacher.specialty;
  const descriptionLabel =
    teacher.id === "mahbub-hasan"
      ? "দ্রুত প্যাটার্ন চিনে সহজ পদ্ধতিতে অঙ্ক সমাধানের অনুশীলন করান, যাতে পরীক্ষায় সময়ের মধ্যে নির্ভুল উত্তর দেওয়া যায়।"
      : teacher.description;
  const localizedCourses = courses.map((course) => ({
    ...course,
    examCategory: getExamCategoryLabel(course.examCategory),
    ...(course.id === "math-shortcut-practice"
      ? {
          title: "ব্যাংক নিয়োগ গণিত অনুশীলন",
          description: "ব্যাংক ও সরকারি চাকরির পরীক্ষার জন্য দ্রুত পাটিগণিত, বীজগণিত ও সমস্যা সমাধানের MCQ অনুশীলন।",
          priceLabel: "৳ ৫৯৯",
        }
      : {}),
    teacherName,
  }));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="rounded-xl border bg-card p-5 shadow-sm shadow-indigo-950/[0.025] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <div className="order-last flex min-w-0 flex-1 flex-col gap-4 sm:order-1 sm:py-2">
            <div className="flex flex-wrap gap-1.5 text-xs font-medium">
              <span className="rounded-md bg-secondary/80 px-2 py-1 text-secondary-foreground">{subjectLabel}</span>
              {teacher.examCategories.map((category) => (
                <span key={category} className="rounded-md bg-secondary/80 px-2 py-1 text-secondary-foreground">
                  {category === "Govt Job" ? "সরকারি চাকরি" : category === "Bank" ? "ব্যাংক" : category}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{teacherName}</h1>
              <p className="text-sm font-medium text-muted-foreground">{specialtyLabel}</p>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{descriptionLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 pt-3 text-sm">
              <p>
                <span className="font-semibold">{teacher.studentCount.toLocaleString("bn-BD")}</span>{" "}
                <span className="text-muted-foreground">শিক্ষার্থী</span>
              </p>
              <p>
                <span className="font-semibold">{courses.length.toLocaleString("bn-BD")}</span>{" "}
                <span className="text-muted-foreground">টি কোর্স</span>
              </p>
              <p className="text-muted-foreground">
                {institutionLabel} · {locationLabel}
              </p>
            </div>
          </div>
          <div className="order-first flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-sky-50 to-indigo-100 text-xl font-semibold tracking-tight text-indigo-700 ring-1 ring-sky-200/70 sm:order-2 sm:mt-2 sm:size-36 sm:text-5xl">
            {teacher.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>
      </section>

      <TeacherProfileCourses
        courses={localizedCourses}
        heading={teacher.id === "mahbub-hasan" ? "মাহবুব স্যারের কোর্সসমূহ" : `${teacherName}-এর কোর্সসমূহ`}
      />
    </main>
  );
}
