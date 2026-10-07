"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getExamCategoryLabel } from "@/lib/public-directory-data";
import { StorefrontCourseCard } from "./storefront-course-card";
import type { StorefrontCourse } from "./types";

export function TeacherStorefrontCourses({
  courses,
  teacherSlug,
}: {
  courses: StorefrontCourse[];
  teacherSlug: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("সব কোর্স");
  const categories = useMemo(
    () => ["সব কোর্স", ...new Set(courses.map((course) => getExamCategoryLabel(course.examCategory)))],
    [courses],
  );
  const visibleCourses = courses.filter((course) => {
    const matchesCategory = filter === "সব কোর্স" || getExamCategoryLabel(course.examCategory) === filter;
    const searchable =
      `${course.title} ${course.description} ${course.subject} ${course.examCategory}`.toLocaleLowerCase("bn-BD");
    return matchesCategory && searchable.includes(query.trim().toLocaleLowerCase("bn-BD"));
  });

  return (
    <section
      id="courses"
      className="mx-auto flex w-full max-w-6xl scroll-mt-5 flex-col gap-5 px-4 py-9 sm:px-6 sm:py-12"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-primary">শেখা শুরু করুন</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">কোর্স ও চলমান ব্যাচ</h2>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:items-center">
          <label className="relative min-w-0 sm:w-56">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              name="course-search"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="কোর্স খুঁজুন…"
              aria-label="কোর্স খুঁজুন"
              className="h-10 pl-9"
            />
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" className="h-10 min-w-28 justify-between gap-2" />}
              aria-label={`কোর্সের ধরন: ${filter}`}
            >
              {filter}
              <ChevronDown aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                {categories.map((category) => (
                  <DropdownMenuRadioItem key={category} value={category}>
                    {category}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {visibleCourses.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <StorefrontCourseCard key={course.id} course={course} teacherSlug={teacherSlug} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-card px-5 py-10 text-center">
          <p className="font-semibold text-foreground">এই খোঁজে কোনো কোর্স নেই</p>
          <p className="mt-1 text-sm text-muted-foreground">অন্য নাম বা কোর্সের ধরন দিয়ে খুঁজুন।</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setQuery("");
              setFilter("সব কোর্স");
            }}
          >
            সব কোর্স দেখুন
          </Button>
        </div>
      )}
    </section>
  );
}
