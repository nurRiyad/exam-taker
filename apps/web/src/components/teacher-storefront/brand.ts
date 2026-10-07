import type { StorefrontBrand } from "./types";

export const BRAND_BY_TEACHER: Record<string, StorefrontBrand> = {
  "mahbub-hasan": {
    accent: "var(--primary)",
    accentSoft: "var(--secondary)",
    initials: "মহ",
    tagline: "ব্যাংক ও সরকারি চাকরির গণিত প্রস্তুতি",
  },
  "farhana-akter": {
    accent: "var(--primary)",
    accentSoft: "var(--secondary)",
    initials: "ফআ",
    tagline: "বিসিএস ও চাকরির পরীক্ষার ইংরেজি প্রস্তুতি",
  },
  "sadia-rahman": {
    accent: "var(--primary)",
    accentSoft: "var(--secondary)",
    initials: "সার",
    tagline: "বাংলাদেশ বিষয়াবলি ও সাম্প্রতিক তথ্য",
  },
  "tanvir-ahmed": {
    accent: "var(--primary)",
    accentSoft: "var(--secondary)",
    initials: "তআ",
    tagline: "যুক্তি ও বিশ্লেষণী দক্ষতার অনুশীলন",
  },
};

export function getStorefrontBrand(teacherId: string) {
  return BRAND_BY_TEACHER[teacherId] ?? BRAND_BY_TEACHER["mahbub-hasan"];
}
