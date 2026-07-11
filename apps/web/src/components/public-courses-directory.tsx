"use client";

import { useState } from "react";
import { PublicCourseCard } from "@/components/public-course-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COURSE_FILTERS, PUBLIC_COURSES } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

export function PublicCoursesDirectory() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof COURSE_FILTERS)[number]>("All");

  const normalizedQuery = query.trim().toLowerCase();
  const courses = PUBLIC_COURSES.filter((course) => {
    const matchesFilter = filter === "All" || course.subject === filter;
    const matchesQuery = [course.title, course.description, course.teacherName, course.subject]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by course, teacher, or subject"
          aria-label="Search courses"
          className="sm:max-w-sm"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {COURSE_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                buttonVariants({ variant: filter === item ? "default" : "outline", size: "sm" }),
                "shrink-0",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <PublicCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">No courses matched your search.</div>
      )}
    </div>
  );
}
