import { TeacherPublicProfileSettings } from "@/components/teacher-public-profile-settings";

export default function TeacherProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-7 sm:px-6 sm:py-10">
      <header>
        <p className="text-sm font-medium text-primary">সবার জন্য দৃশ্যমান তথ্য</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">আমার শিক্ষক প্রোফাইল</h1>
        <p className="mt-2 text-sm text-muted-foreground">আপনার শিক্ষক পেজে শিক্ষার্থীরা যে পরিচিতি দেখবে।</p>
      </header>
      <TeacherPublicProfileSettings />
    </main>
  );
}
