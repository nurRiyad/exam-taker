import type { TeacherPublicProfileInput } from "@exam-taker/validation";
import type { PublicUser } from "../../utils/user";

const DEMO_PUBLIC_PROFILE: TeacherPublicProfileInput = {
  name: "কাফি",
  specialty: "বিসিএস ও সরকারি চাকরির প্রস্তুতি",
  bio: "পরিকল্পিত অনুশীলন ও নিয়মিত পরীক্ষার মাধ্যমে প্রস্তুতিকে সহজ করি।",
  description:
    "বিষয়ভিত্তিক পাঠ, সময় ধরে এমসিকিউ অনুশীলন এবং ভুলের পর্যালোচনার মাধ্যমে শিক্ষার্থীদের পরীক্ষার জন্য প্রস্তুত করি।",
  institution: "কাফি’স একাডেমি",
  location: "ঢাকা, বাংলাদেশ",
  subject: "সাধারণ জ্ঞান ও ইংরেজি",
};

/** Demo profile data; persistence is intentionally out of scope. */
export function getTeacherPublicProfile(user: PublicUser): TeacherPublicProfileInput {
  return { ...DEMO_PUBLIC_PROFILE, name: user.name ?? DEMO_PUBLIC_PROFILE.name };
}

/** Echoes validated demo data without persisting it. */
export function updateTeacherPublicProfile(input: TeacherPublicProfileInput): TeacherPublicProfileInput {
  return input;
}
