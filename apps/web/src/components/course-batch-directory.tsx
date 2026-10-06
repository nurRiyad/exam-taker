"use client";

import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BatchCard } from "@/components/batch-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { CourseBatch } from "@/lib/course-batches";

const STATUS_FILTERS = ["সব", "চলমান", "শিগগিরই", "শেষ"] as const;

export function CourseBatchDirectory({ courseId, batches }: { courseId: string; batches: CourseBatch[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("সব");
  const filteredBatches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("bn-BD");
    return batches.filter((batch) => {
      const matchesStatus = status === "সব" || batch.status === status;
      const matchesQuery = `${batch.title} ${batch.description}`.toLocaleLowerCase("bn-BD").includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [batches, query, status]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="shrink-0 text-xl font-semibold tracking-tight">ব্যাচসমূহ</h2>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:items-center">
          <label className="relative min-w-0 sm:w-52">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ব্যাচ খুঁজুন"
              aria-label="ব্যাচ খুঁজুন"
              className="h-9 pl-9"
            />
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" className="h-9 gap-2" />}
              aria-label={`ব্যাচের অবস্থা: ${status}`}
            >
              {status}
              <ChevronDown aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={(value) => setStatus(value as (typeof STATUS_FILTERS)[number])}
              >
                {STATUS_FILTERS.map((item) => (
                  <DropdownMenuRadioItem key={item} value={item}>
                    {item}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredBatches.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              href={`/courses/${courseId}/batches/${batch.id}`}
              actionLabel="ব্যাচ দেখুন"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
          {batches.length ? "এই খোঁজে কোনো ব্যাচ পাওয়া যায়নি।" : "এই কোর্সে এখনো কোনো ব্যাচ নেই। নতুন ব্যাচ তৈরি করুন।"}
        </div>
      )}
    </section>
  );
}
