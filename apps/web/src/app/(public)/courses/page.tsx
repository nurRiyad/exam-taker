import { PublicCoursesDirectory } from "@/components/public-courses-directory";

export default function CoursesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Public courses</p>
        <h1 className="text-3xl font-semibold tracking-tight">Find an exam course</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Browse published course routes from teachers. These cards use sample content until the public course API is
          connected.
        </p>
      </section>
      <PublicCoursesDirectory />
    </main>
  );
}
