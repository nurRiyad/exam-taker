import { PublicCoursesDirectory } from "@/components/public-courses-directory";

export default function CoursesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="flex flex-col gap-1">
        <p className="text-sm font-medium text-primary">কোর্স তালিকা</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">পরীক্ষার কোর্স খুঁজুন</h1>
        <p className="text-sm text-muted-foreground">বিষয় বা শিক্ষকের নামে খুঁজুন।</p>
      </section>
      <PublicCoursesDirectory />
    </main>
  );
}
