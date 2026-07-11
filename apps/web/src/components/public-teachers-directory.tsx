"use client";

import { useState } from "react";
import { PublicTeacherCard } from "@/components/public-teacher-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PUBLIC_TEACHERS, TEACHER_FILTERS } from "@/lib/public-directory-data";
import { cn } from "@/lib/utils";

export function PublicTeachersDirectory() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof TEACHER_FILTERS)[number]>("All");

  const normalizedQuery = query.trim().toLowerCase();
  const teachers = PUBLIC_TEACHERS.filter((teacher) => {
    const matchesFilter = filter === "All" || teacher.subject === filter;
    const matchesQuery = [teacher.name, teacher.specialty, teacher.bio, teacher.subject, teacher.institution]
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
          placeholder="Search by teacher, subject, or institution"
          aria-label="Search teachers"
          className="sm:max-w-sm"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {TEACHER_FILTERS.map((item) => (
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

      {teachers.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <PublicTeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">No teachers matched your search.</div>
      )}
    </div>
  );
}