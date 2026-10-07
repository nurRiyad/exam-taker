import Image from "next/image";
import { ArrowDown, GraduationCap, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicTeacher } from "@/lib/public-directory-data";
import type { StorefrontBrand } from "./types";
import { getStorefrontTeacherCopy } from "./content";

export function TeacherStorefrontHero({ teacher, brand }: { teacher: PublicTeacher; brand: StorefrontBrand }) {
  const copy = getStorefrontTeacherCopy(teacher);
  const categories = teacher.examCategories.map(getExamCategoryLabel).join(" · ");

  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[var(--teacher-accent)]" />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
        <div className="flex flex-col items-start gap-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--teacher-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--teacher-accent)]">
            <GraduationCap aria-hidden="true" className="size-4" />
            {brand.tagline}
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {teacher.name}-এর ক্লাসে প্রস্তুতি হোক আত্মবিশ্বাসের
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{copy.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#courses"
              className={cn(buttonVariants(), "h-11 gap-2 bg-primary text-primary-foreground hover:opacity-90")}
            >
              কোর্স ও ব্যাচ দেখুন <ArrowDown aria-hidden="true" className="size-4" />
            </a>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="size-4" />
              {getLocationLabel(teacher.location)}
            </span>
          </div>
        </div>

        <div className="relative isolate min-h-[320px] w-full overflow-hidden rounded-2xl border border-border bg-secondary/40 shadow-md shadow-foreground/[0.05] md:w-72">
          {teacher.photoUrl ? (
            <Image
              src={teacher.photoUrl}
              alt={teacher.name}
              fill
              priority
              sizes="(min-width: 768px) 18rem, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label={`${teacher.name}-এর ছবির স্থান`}
              className="absolute inset-0 flex items-start justify-center overflow-hidden bg-gradient-to-br from-secondary via-background to-[var(--teacher-accent-soft)] pt-8"
            >
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 size-48 rounded-full bg-[var(--teacher-accent)]/10 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-10 -left-10 size-48 rounded-full bg-[var(--teacher-accent)]/15 blur-2xl"
              />
              <span className="relative flex size-36 items-center justify-center rounded-[2rem] border border-white/70 bg-white/60 text-5xl font-bold text-[var(--teacher-accent)] shadow-lg shadow-[var(--teacher-accent)]/10 backdrop-blur-sm">
                {brand.initials}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/95 via-foreground/70 to-transparent px-5 pb-5 pt-24 text-background">
            <p className="text-lg font-semibold leading-tight tracking-tight">{teacher.name}</p>
            <p className="mt-0.5 text-xs text-background/80">{teacher.institution}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-background/20 pt-3">
              <span className="text-xs">
                <span className="font-semibold">{teacher.studentCount.toLocaleString("bn-BD")}+</span> শিক্ষার্থী
              </span>
              <span className="text-right text-xs text-background/75">{categories}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getLocationLabel(location: string) {
  const labels: Record<string, string> = {
    Dhaka: "ঢাকা",
    Chattogram: "চট্টগ্রাম",
    Rajshahi: "রাজশাহী",
    Sylhet: "সিলেট",
  };
  return labels[location] ?? location;
}

function getExamCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    "Govt Job": "সরকারি চাকরি",
    Bank: "ব্যাংক",
    Primary: "প্রাথমিক",
    BCS: "বিসিএস",
  };
  return labels[category] ?? category;
}
