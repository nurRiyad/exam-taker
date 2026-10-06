import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "এক্সাম টেকার — MCQ শেখার প্ল্যাটফর্ম",
  description: "শিক্ষক ও শিক্ষার্থীদের জন্য সহজ MCQ পরীক্ষা প্ল্যাটফর্ম।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteNavbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
