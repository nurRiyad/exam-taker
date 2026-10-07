import type { CourseBatch } from "@/lib/course-batches";
import type { PublicCourse, PublicTeacher } from "@/lib/public-directory-data";

export type StorefrontCourse = PublicCourse & { batches: CourseBatch[] };
export type TeacherStorefrontProps = { teacher: PublicTeacher; courses: StorefrontCourse[] };
export type StorefrontBrand = { accent: string; accentSoft: string; initials: string; tagline: string };
