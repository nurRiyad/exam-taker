import { PublicTeachersDirectory } from "@/components/public-teachers-directory";

export default function TeachersPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Public teachers</p>
        <h1 className="text-3xl font-semibold tracking-tight">Find a teacher</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Compare teachers by subject, profile, student reach, and popular courses. These cards use sample content until
          the public teacher API is connected.
        </p>
      </section>
      <PublicTeachersDirectory />
    </main>
  );
}
