import { getStorefrontBrand } from "./brand";
import { TeacherStorefrontCourses } from "./teacher-storefront-courses";
import { TeacherStorefrontHeader } from "./teacher-storefront-header";
import { TeacherStorefrontHero } from "./teacher-storefront-hero";
import { TeacherPageFooter } from "./teacher-page-footer";
import type { TeacherStorefrontProps } from "./types";

export function TeacherStorefront({ teacher, courses }: TeacherStorefrontProps) {
  const brand = getStorefrontBrand(teacher.id);

  return (
    <div
      className="flex min-h-screen flex-col bg-background text-foreground"
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
      <TeacherPageFooter teacher={teacher} className="bg-muted/30" />
    </div>
  );
}
