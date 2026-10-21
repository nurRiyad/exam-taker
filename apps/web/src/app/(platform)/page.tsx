import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  ChartNoAxesCombined,
  CircleCheck,
  CircleDollarSign,
  GraduationCap,
  MoveUpRight,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    icon: BookOpenCheck,
    number: "০১",
    title: "এক মিনিটে MCQ পরীক্ষা",
    description: "প্রশ্ন বাছাই করুন, সময় ঠিক করুন, আর এক ক্লিকেই কোর্সের জন্য পরীক্ষা প্রকাশ করুন।",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: ChartNoAxesCombined,
    number: "০২",
    title: "শিক্ষার্থীর অগ্রগতি দেখুন",
    description: "কে নিয়মিত পরীক্ষা দিচ্ছে, ফল কেমন হচ্ছে—সব দেখুন সহজ একটি ড্যাশবোর্ডে।",
    color: "bg-sky-100 text-sky-700",
  },
  {
    icon: Target,
    number: "০৩",
    title: "দুর্বল অধ্যায় খুঁজে দিন",
    description: "বিষয়ভিত্তিক ফল বিশ্লেষণ করে বুঝুন, কোথায় আরও অনুশীলন দরকার।",
    color: "bg-amber-100 text-amber-700",
  },
] as const;

const STEPS = [
  { title: "নিজের অ্যাকাউন্ট খুলুন", detail: "শিক্ষক হিসেবে যোগ দিন" },
  { title: "কোর্স ও পরীক্ষা সাজান", detail: "নিজের কনটেন্ট, নিজের নিয়মে" },
  { title: "নিজের ব্র্যান্ডে শেখান", detail: "শিক্ষার্থীদের সাথে লিংক শেয়ার করুন" },
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <section className="relative isolate border-b border-violet-100 bg-[#f8f7ff]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-36 -z-10 size-[28rem] rounded-full bg-violet-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 left-[-8rem] -z-10 size-[24rem] rounded-full bg-sky-200/40 blur-3xl"
        />
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-14 lg:py-24">
          <div className="flex flex-col items-start gap-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-violet-800 shadow-sm sm:text-sm">
              <Sparkles aria-hidden="true" className="size-4" /> শিক্ষকদের জন্য স্মার্ট পরীক্ষা প্ল্যাটফর্ম
            </p>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.16] tracking-tight text-slate-950 text-balance sm:text-5xl lg:text-[3.65rem]">
                আপনার পড়ানোকে দিন <span className="text-violet-700">নিজস্ব পরিচয়</span>
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                কোর্স তৈরি, MCQ পরীক্ষা, শিক্ষার্থীর অগ্রগতি—সব সামলান এক জায়গায়। নিজের কোর্স আর ব্র্যান্ড নিয়ে
                অনলাইনে এগিয়ে যান।
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 w-full gap-2 bg-violet-700 px-6 text-base hover:bg-violet-800 sm:w-auto",
                )}
              >
                শিক্ষক অ্যাকাউন্ট খুলুন <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="#কীভাবে-কাজ-করে"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 w-full gap-2 border-slate-300 bg-white/70 px-6 text-base sm:w-auto",
                )}
              >
                কীভাবে কাজ করে <ArrowDown aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <p className="text-sm text-slate-500">
              <CircleCheck aria-hidden="true" className="mr-1.5 inline size-4 text-emerald-600" />
              কোর্সের প্রথম ৫টি পরীক্ষা বিনামূল্যে
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem]">
            <div className="absolute -inset-3 -rotate-2 rounded-[2rem] bg-violet-200/70 sm:-inset-4" />
            <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-violet-950/10 sm:rounded-3xl sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">শিক্ষক ড্যাশবোর্ড</p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">আপনার কোর্সের খবর</h2>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
                  <GraduationCap aria-hidden="true" className="size-5" />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4">
                  <p className="text-xs text-slate-500">সক্রিয় শিক্ষার্থী</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">১২৮</p>
                  <p className="mt-1 text-xs font-medium text-emerald-700">গত মাসের চেয়ে +১২%</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4">
                  <p className="text-xs text-slate-500">গড় ফলাফল</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    ৭৬<span className="text-base">%</span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-sky-700">এই সপ্তাহে +৫%</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-950">
                  <Target aria-hidden="true" className="size-4 text-amber-700" />
                  আরও অনুশীলন দরকার
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-700">জৈব রসায়ন</span>
                  <span className="font-semibold text-amber-800">গড় ৪২%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-100">
                  <div className="h-full w-[42%] rounded-full bg-amber-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 p-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-sky-100 text-sky-700">
                    <UsersRound aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">সাপ্তাহিক মডেল টেস্ট</p>
                    <p className="text-xs text-slate-500">৩৬ জন অংশ নিয়েছে</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-violet-700">৮১%</span>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-violet-700 px-4 py-3 text-white">
                <div>
                  <p className="text-sm font-semibold">পরবর্তী পরীক্ষা তৈরি</p>
                  <p className="mt-0.5 text-xs text-violet-100">প্রশ্ন বাছুন, প্রকাশ করুন</p>
                </div>
                <span className="grid size-8 place-items-center rounded-lg bg-white/15">
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-2 hidden items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-lg sm:flex">
              <CircleCheck aria-hidden="true" className="size-4 text-emerald-600" />
              কোর্স আপডেট হয়েছে
            </div>
          </div>
        </div>
      </section>

      <section id="সুবিধা" className="scroll-mt-8 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="text-sm font-semibold text-violet-700">শিক্ষকের হাতে আরও নিয়ন্ত্রণ</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 text-balance sm:text-3xl">
            পড়ানো থেকে অগ্রগতি—সব এক প্ল্যাটফর্মে
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            আপনার সময় বাঁচাতে এবং প্রতিটি শিক্ষার্থীকে এগিয়ে নিতে দরকারি টুলগুলো।
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {BENEFITS.map(({ icon: Icon, number, title, description, color }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className={cn("grid size-11 place-items-center rounded-xl", color)}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-slate-400">{number}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="কীভাবে-কাজ-করে" className="scroll-mt-8 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-sm font-semibold text-violet-700">শুরু করাও সহজ</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              আপনার ক্লাস, আপনার ব্র্যান্ড
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              একটি শিক্ষক অ্যাকাউন্ট থেকেই কোর্স সাজান, শিক্ষার্থীদের আমন্ত্রণ জানান, আর নিজের পরিচয়ে পড়ানো শুরু করুন।
            </p>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "link" }),
                "mt-3 h-auto gap-1 px-0 font-semibold text-violet-700",
              )}
            >
              আজই শুরু করুন <MoveUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <ol className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-col sm:gap-5 sm:p-5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">
                  ০{index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="মূল্য" className="scroll-mt-8 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="overflow-hidden rounded-2xl bg-[#21164d] px-5 py-8 text-white sm:rounded-3xl sm:px-9 sm:py-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-violet-100">
              <CircleDollarSign aria-hidden="true" className="size-4" />
              শিক্ষার্থীর সাথে বাড়ুক খরচ
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              প্রথম ৫টি পরীক্ষা ফ্রি। এরপর ভর্তি শিক্ষার্থী অনুযায়ী পেমেন্ট।
            </h2>
            <p className="mt-3 text-sm leading-6 text-violet-100/80 sm:text-base">
              কোর্সের শুরুতে কোনো খরচ নেই। আপনার কোর্সে কতজন শিক্ষার্থী যোগ দিচ্ছে, তার ভিত্তিতেই পরের পরীক্ষার খরচ
              হিসাব হবে।
            </p>
          </div>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 h-12 w-full shrink-0 gap-2 bg-white px-6 text-base text-violet-900 hover:bg-violet-50 lg:mt-0 lg:w-auto",
            )}
          >
            ফ্রি অ্যাকাউন্ট খুলুন <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
