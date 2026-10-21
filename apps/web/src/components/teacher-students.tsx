"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TeacherStudent } from "@/utils/teacher-access-requests";

export function TeacherStudents({ students }: { students: TeacherStudent[] }) {
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const courses = useMemo(() => [...new Set(students.map((student) => student.courseTitle))], [students]);
  const batches = useMemo(
    () => [
      ...new Set(
        students
          .filter((student) => courseFilter === "all" || student.courseTitle === courseFilter)
          .map((student) => student.batchTitle),
      ),
    ],
    [students, courseFilter],
  );
  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          (courseFilter === "all" || student.courseTitle === courseFilter) &&
          (batchFilter === "all" || student.batchTitle === batchFilter) &&
          `${student.name} ${student.username}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
      ),
    [students, courseFilter, batchFilter, query],
  );
  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const setCourse = (value: string) => {
    setCourseFilter(value);
    setBatchFilter("all");
    setPage(1);
  };
  const courseItems = [
    { value: "all", label: "সব কোর্স" },
    ...courses.map((course) => ({ value: course, label: course })),
  ];
  const batchItems = [{ value: "all", label: "সব ব্যাচ" }, ...batches.map((batch) => ({ value: batch, label: batch }))];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-7 sm:px-6 sm:py-9">
      <header>
        <p className="text-sm font-medium text-primary">শিক্ষক ড্যাশবোর্ড</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">শিক্ষার্থী তালিকা</h1>
      </header>

      <section aria-label="শিক্ষার্থীর সারসংক্ষেপ" className="grid grid-cols-2 gap-3">
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>মোট শিক্ষার্থী</CardDescription>
              <CardTitle>{students.length.toLocaleString("bn-BD")} জন</CardTitle>
            </div>
            <UsersRound className="size-5 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>মোট কোর্স</CardDescription>
            <CardTitle>{courses.length.toLocaleString("bn-BD")}টি</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section aria-label="শিক্ষার্থী ফিল্টার" className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_1fr_1fr]">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          শিক্ষার্থী খুঁজুন
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="নাম বা ইউজারনেম"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          কোর্স
          <Select
            items={courseItems}
            value={courseFilter}
            onValueChange={(value: string | null) => setCourse(value ?? "all")}
          >
            <SelectTrigger aria-label="কোর্স নির্বাচন">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {courseItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          ব্যাচ
          <Select
            items={batchItems}
            value={batchFilter}
            onValueChange={(value: string | null) => {
              setBatchFilter(value ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="ব্যাচ নির্বাচন">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {batchItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>
      </section>

      <section aria-labelledby="all-students-heading">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 id="all-students-heading" className="text-lg font-semibold">
            শিক্ষার্থী তালিকা
          </h2>
          <span className="text-sm text-muted-foreground">{filteredStudents.length.toLocaleString("bn-BD")} জন</span>
        </div>
        {filteredStudents.length ? (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            {visibleStudents.map((student, index) => (
              <article
                key={student.id}
                className={`flex flex-col gap-2 p-4 sm:flex-row sm:items-center ${index ? "border-t" : ""}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {student.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{student.name}</p>
                  <p className="truncate text-xs text-muted-foreground">@{student.username}</p>
                </div>
                <div className="min-w-0 text-sm sm:max-w-[50%] sm:text-right">
                  <p className="truncate font-medium">{student.courseTitle}</p>
                  <p className="truncate text-xs text-muted-foreground">{student.batchTitle}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            এই ফিল্টারে কোনো শিক্ষার্থী নেই।
          </div>
        )}
        {pageCount > 1 ? (
          <nav aria-label="শিক্ষার্থীর পৃষ্ঠা" className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {((currentPage - 1) * pageSize + 1).toLocaleString("bn-BD")}–
              {Math.min(currentPage * pageSize, filteredStudents.length).toLocaleString("bn-BD")} /{" "}
              {filteredStudents.length.toLocaleString("bn-BD")}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                aria-label="আগের পৃষ্ঠা"
              >
                <ChevronLeft /> আগের
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === pageCount}
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                aria-label="পরের পৃষ্ঠা"
              >
                পরের <ChevronRight />
              </Button>
            </div>
          </nav>
        ) : null}
      </section>
    </main>
  );
}
