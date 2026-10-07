import type { PublicCourse, PublicTeacher } from "@/lib/public-directory-data";

const TEACHER_COPY: Record<string, { description: string; biography: string }> = {
  "mahbub-hasan": {
    description:
      "দ্রুত প্যাটার্ন চিনে সহজ পদ্ধতিতে অঙ্ক সমাধানের অনুশীলন করুন, যাতে পরীক্ষায় সময়ের মধ্যে নির্ভুল উত্তর দিতে পারেন।",
    biography: "ব্যবহারিক শর্টকাট পদ্ধতি, দৈনিক অনুশীলন ও বারবার পরীক্ষাভিত্তিক প্রশ্ন সমাধানের মাধ্যমে গণিত শেখান।",
  },
  "farhana-akter": {
    description: "ছোট ছোট অনুশীলন, পরিষ্কার ব্যাখ্যা ও সাপ্তাহিক মকের মাধ্যমে ইংরেজি প্রস্তুতিকে নিয়মিত করুন।",
    biography: "ব্যাকরণভিত্তিক পাঠ, সাপ্তাহিক মক এবং ভুলের স্পষ্ট ব্যাখ্যার মাধ্যমে ইংরেজি শেখান।",
  },
  "sadia-rahman": {
    description: "ইতিহাস, সংবিধান, ভূগোল ও সাম্প্রতিক বিষয় গুছিয়ে MCQ অনুশীলনের মাধ্যমে প্রস্তুতি নিন।",
    biography: "বাংলাদেশ বিষয়াবলির বিস্তৃত পাঠ্যসূচিকে ছোট ছোট অধ্যায়ে ভাগ করে নিয়মিত MCQ অনুশীলন করান।",
  },
  "tanvir-ahmed": {
    description: "যুক্তির ধরন বুঝে সময় ধরে অনুশীলন করুন এবং কোন জায়গায় ভুল হচ্ছে তা খুঁজে নিন।",
    biography: "যুক্তির প্যাটার্ন, সময় ধরে সমস্যা সমাধান এবং দুর্বল বিষয়ের পুনরালোচনায় গুরুত্ব দেন।",
  },
};

export function getStorefrontTeacherCopy(teacher: PublicTeacher) {
  return TEACHER_COPY[teacher.id] ?? { description: teacher.description, biography: teacher.bio };
}

export function getStorefrontTeacherSpecialty(teacher: PublicTeacher) {
  const labels: Record<string, string> = {
    "mahbub-hasan": "সময়বদ্ধ পরীক্ষার জন্য গণিতের শর্টকাট পদ্ধতি",
    "farhana-akter": "বিসিএস ইংরেজি ও ভাষা দক্ষতা",
    "sadia-rahman": "বাংলাদেশ বিষয়াবলি ও সাম্প্রতিক ঘটনা",
    "tanvir-ahmed": "যুক্তি ও বিশ্লেষণী দক্ষতা",
  };
  return labels[teacher.id] ?? teacher.specialty;
}

export function getStorefrontCourseCopy(course: PublicCourse) {
  switch (course.id) {
    case "math-shortcut-practice":
      return {
        title: "গণিত শর্টকাট অনুশীলন",
        description: "ব্যাংক ও সরকারি চাকরির পরীক্ষার জন্য দ্রুত পাটিগণিত, বীজগণিত ও সমস্যা সমাধানের অনুশীলন।",
        price: "৳ ৫৯৯",
      };
    case "bcs-english-foundation":
      return {
        title: "বিসিএস ইংরেজি ভিত্তি কোর্স",
        description: "বিসিএস ও সরকারি চাকরির পরীক্ষার জন্য ব্যাকরণ, শব্দভান্ডার, অনুধাবন ও সময় ধরে MCQ অনুশীলন।",
        price: "৳ ৪৯৯",
      };
    case "bangladesh-affairs-mcq":
      return {
        title: "বাংলাদেশ বিষয়াবলি MCQ",
        description: "ইতিহাস, সংবিধান, ভূগোল ও সাম্প্রতিক বিষয় নিয়ে পরীক্ষাভিত্তিক MCQ অনুশীলন।",
        price: "বিনামূল্যে",
      };
    case "reasoning-masterclass":
      return {
        title: "যুক্তি ও বিশ্লেষণী দক্ষতা",
        description: "যুক্তি, উপমা, ধারা ও বিশ্লেষণী প্রশ্নে সময় ধরে অনুশীলন এবং দুর্বল বিষয় চিহ্নিত করুন।",
        price: "৳ ৬৯৯",
      };
    default:
      return { title: course.title, description: course.description, price: course.priceLabel };
  }
}

export function getStorefrontBatchTitle(batchTitle: string, course: PublicCourse) {
  if (batchTitle.endsWith("· ২০২৬ ব্যাচ")) return `${getStorefrontCourseCopy(course).title} · ২০২৬ ব্যাচ`;
  return batchTitle;
}
