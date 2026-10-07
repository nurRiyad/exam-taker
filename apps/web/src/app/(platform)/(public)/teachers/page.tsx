import { PublicTeachersDirectory } from "@/components/public-teachers-directory";

export default function TeachersPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="flex flex-col gap-1">
        <p className="text-sm font-medium text-primary">আমাদের শিক্ষক</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">প্রস্তুতির জন্য শিক্ষক খুঁজুন</h1>
        <p className="text-sm text-muted-foreground">পরীক্ষার ধরন অনুযায়ী অভিজ্ঞ শিক্ষক বেছে নিন।</p>
      </section>
      <PublicTeachersDirectory />
    </main>
  );
}
