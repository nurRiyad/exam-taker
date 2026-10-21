export type HomePageContent = {
  hero: {
    eyebrow: string;
    titleStart: string;
    titleEmphasis: string;
    description: string;
    activeStudents: string;
    studentChange: string;
    averageScore: string;
    scoreChange: string;
    weakZoneTitle: string;
    weakZoneAverage: string;
    weeklyExamTitle: string;
    weeklyExamParticipants: string;
    weeklyExamScore: string;
    nextExamTitle: string;
    nextExamDescription: string;
    updateNotice: string;
    freeExamsNotice: string;
  };
  benefitsHeading: string;
  benefitsDescription: string;
  benefits: Array<{ number: string; title: string; description: string; icon: "exam" | "progress" | "target" }>;
  stepsEyebrow: string;
  stepsTitle: string;
  stepsDescription: string;
  steps: Array<{ title: string; detail: string }>;
  pricingEyebrow: string;
  pricingTitle: string;
  pricingDescription: string;
};

export const homePageContent = {
  hero: {
    eyebrow: "শিক্ষকদের জন্য স্মার্ট পরীক্ষা প্ল্যাটফর্ম",
    titleStart: "আপনার পড়ানোকে দিন",
    titleEmphasis: "নিজস্ব পরিচয়",
    description:
      "কোর্স তৈরি, MCQ পরীক্ষা, শিক্ষার্থীর অগ্রগতি—সব সামলান এক জায়গায়। নিজের কোর্স আর ব্র্যান্ড নিয়ে অনলাইনে এগিয়ে যান।",
    activeStudents: "১২৮",
    studentChange: "গত মাসের চেয়ে +১২%",
    averageScore: "৭৬",
    scoreChange: "এই সপ্তাহে +৫%",
    weakZoneTitle: "জৈব রসায়ন",
    weakZoneAverage: "গড় ৪২%",
    weeklyExamTitle: "সাপ্তাহিক মডেল টেস্ট",
    weeklyExamParticipants: "৩৬ জন অংশ নিয়েছে",
    weeklyExamScore: "৮১%",
    nextExamTitle: "পরবর্তী পরীক্ষা তৈরি",
    nextExamDescription: "প্রশ্ন বাছুন, প্রকাশ করুন",
    updateNotice: "কোর্স আপডেট হয়েছে",
    freeExamsNotice: "কোর্সের প্রথম ৫টি পরীক্ষা বিনামূল্যে",
  },
  benefitsHeading: "পড়ানো থেকে অগ্রগতি—সব এক প্ল্যাটফর্মে",
  benefitsDescription: "আপনার সময় বাঁচাতে এবং প্রতিটি শিক্ষার্থীকে এগিয়ে নিতে দরকারি টুলগুলো।",
  benefits: [
    {
      number: "০১",
      title: "এক মিনিটে MCQ পরীক্ষা",
      description: "প্রশ্ন বাছাই করুন, সময় ঠিক করুন, আর এক ক্লিকেই কোর্সের জন্য পরীক্ষা প্রকাশ করুন।",
      icon: "exam",
    },
    {
      number: "০২",
      title: "শিক্ষার্থীর অগ্রগতি দেখুন",
      description: "কে নিয়মিত পরীক্ষা দিচ্ছে, ফল কেমন হচ্ছে—সব দেখুন সহজ একটি ড্যাশবোর্ডে।",
      icon: "progress",
    },
    {
      number: "০৩",
      title: "দুর্বল অধ্যায় খুঁজে দিন",
      description: "বিষয়ভিত্তিক ফল বিশ্লেষণ করে বুঝুন, কোথায় আরও অনুশীলন দরকার।",
      icon: "target",
    },
  ],
  stepsEyebrow: "শুরু করাও সহজ",
  stepsTitle: "আপনার ক্লাস, আপনার ব্র্যান্ড",
  stepsDescription:
    "একটি শিক্ষক অ্যাকাউন্ট থেকেই কোর্স সাজান, শিক্ষার্থীদের আমন্ত্রণ জানান, আর নিজের পরিচয়ে পড়ানো শুরু করুন।",
  steps: [
    { title: "নিজের অ্যাকাউন্ট খুলুন", detail: "শিক্ষক হিসেবে যোগ দিন" },
    { title: "কোর্স ও পরীক্ষা সাজান", detail: "নিজের কনটেন্ট, নিজের নিয়মে" },
    { title: "নিজের ব্র্যান্ডে শেখান", detail: "শিক্ষার্থীদের সাথে লিংক শেয়ার করুন" },
  ],
  pricingEyebrow: "শিক্ষার্থীর সাথে বাড়ুক খরচ",
  pricingTitle: "প্রথম ৫টি পরীক্ষা ফ্রি। এরপর ভর্তি শিক্ষার্থী অনুযায়ী পেমেন্ট।",
  pricingDescription:
    "কোর্সের শুরুতে কোনো খরচ নেই। আপনার কোর্সে কতজন শিক্ষার্থী যোগ দিচ্ছে, তার ভিত্তিতেই পরের পরীক্ষার খরচ হিসাব হবে।",
} satisfies HomePageContent;
