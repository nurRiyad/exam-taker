import { getStorefrontBrand } from "./brand";
import { TeacherStorefrontCourses } from "./teacher-storefront-courses";
import { TeacherStorefrontHeader } from "./teacher-storefront-header";
import { TeacherStorefrontHero } from "./teacher-storefront-hero";
import type { TeacherStorefrontProps } from "./types";

export function TeacherStorefront({ teacher, courses }: TeacherStorefrontProps) {
  const brand = getStorefrontBrand(teacher.id);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ "--teacher-accent": brand.accent, "--teacher-accent-soft": brand.accentSoft } as React.CSSProperties}
    >
      <TeacherStorefrontHeader teacher={teacher} brand={brand} />
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring"
      >
        মূল কনটেন্টে যান
      </a>
      <div id="main-content">
        <TeacherStorefrontHero teacher={teacher} brand={brand} />
      </div>
      <TeacherStorefrontCourses courses={courses} teacherSlug={teacher.id} />
      <footer className="mt-auto border-t border-border bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            © {new Date().getFullYear()} {teacher.name}
          </span>
          <span>অনলাইন কোর্স ও পরীক্ষা</span>
        </div>
      </footer>
    </main>
  );
}
