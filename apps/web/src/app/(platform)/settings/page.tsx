import { AccountSettings } from "@/components/account-settings";

export default function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-7 sm:px-6 sm:py-10">
      <header>
        <p className="text-sm font-medium text-primary">আপনার অ্যাকাউন্ট</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">সেটিংস</h1>
        <p className="mt-2 text-sm text-muted-foreground">ব্যক্তিগত তথ্য দেখুন ও হালনাগাদ করুন।</p>
      </header>
      <AccountSettings />
    </main>
  );
}
