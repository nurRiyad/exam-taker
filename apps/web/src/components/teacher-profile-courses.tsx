"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus, Search } from "lucide-react";
import { PublicCourseCard } from "@/components/public-course-card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getExamCategoryLabel, type PublicCourse } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = ["সব", "BCS", "ব্যাংক", "সরকারি চাকরি", "প্রাথমিক"] as const;

export function TeacherProfileCourses({ courses, heading }: { courses: PublicCourse[]; heading: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>("সব");
  const normalizedQuery = query.trim().toLocaleLowerCase("bn-BD");
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = category === "সব" || getExamCategoryLabel(course.examCategory) === category;
    const matchesQuery = `${course.title} ${course.description} ${course.examCategory}`
      .toLocaleLowerCase("bn-BD")
      .includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:items-center">
          <label className="relative min-w-0 sm:w-52">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="কোর্স খুঁজুন"
              aria-label="কোর্স খুঁজুন"
              className="h-9 pl-9"
            />
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" className="h-9 gap-2" />}
              aria-label={`পরীক্ষার ধরন: ${category}`}
            >
              {category}
              <ChevronDown aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuRadioGroup
                value={category}
                onValueChange={(value) => setCategory(value as (typeof CATEGORY_OPTIONS)[number])}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem key={option} value={option}>
                    {option}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/teacher/courses/new"
            className={cn(buttonVariants({ size: "sm" }), "col-span-2 h-9 sm:col-span-1")}
          >
            <Plus aria-hidden="true" data-icon="inline-start" />
            কোর্স তৈরি
          </Link>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <PublicCourseCard key={course.id} course={course} locale="bn" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-6 text-sm text-muted-foreground">এই খোঁজে কোনো কোর্স পাওয়া যায়নি।</div>
      )}
    </section>
  );
}
