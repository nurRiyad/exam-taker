"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, ChevronRight, UserRound, UsersRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TeacherAccessRequest } from "@/utils/teacher-access-requests";

type RequestStatus = "pending" | "approved" | "rejected";

export function TeacherDashboard({ initialRequests }: { initialRequests: TeacherAccessRequest[] }) {
  const [statuses, setStatuses] = useState<Record<string, RequestStatus>>({});
  const [requestPage, setRequestPage] = useState(1);
  const pageSize = 5;
  const pendingRequests = initialRequests.filter((request) => (statuses[request.id] ?? "pending") === "pending");
  const pendingCount = pendingRequests.length;
  const pageCount = Math.max(1, Math.ceil(pendingCount / pageSize));
  const currentRequestPage = Math.min(requestPage, pageCount);
  const visibleRequests = pendingRequests.slice((currentRequestPage - 1) * pageSize, currentRequestPage * pageSize);
  const updateStatus = (id: string, status: RequestStatus) => setStatuses((current) => ({ ...current, [id]: status }));

  return (
    <div className="space-y-8">
      <nav aria-label="শিক্ষক ব্যবস্থাপনা">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              href: "/teacher/courses",
              title: "কোর্স ও ব্যাচ পরিচালনা",
              description: "কোর্স খুলে তথ্য সম্পাদনা, ব্যাচ যোগ বা আপডেট করুন।",
              icon: ArrowRight,
            },
            {
              href: "/teacher/students",
              title: "শিক্ষার্থী তালিকা",
              description: "কোর্স ও ব্যাচ অনুযায়ী অনুমোদিত শিক্ষার্থী দেখুন।",
              icon: UsersRound,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-20 items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/20 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </nav>

      <section aria-labelledby="pending-requests-heading">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">ব্যাচে যোগদানের আবেদন</p>
            <h2 id="pending-requests-heading" className="mt-1 text-xl font-bold tracking-tight">
              অনুমোদনের অপেক্ষায়
            </h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
            {pendingCount.toLocaleString("bn-BD")}টি বাকি
          </span>
        </div>
        {pendingRequests.length ? (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            {visibleRequests.map((request, index) => (
              <article
                key={request.id}
                className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${index ? "border-t" : ""}`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <UserRound className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{request.student}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    @{request.username} · {request.courseTitle} · {request.batchTitle} · {request.requestedAt}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(request.id, "rejected")}
                  >
                    <X data-icon="inline-start" /> প্রত্যাখ্যান
                  </Button>
                  <Button type="button" size="sm" onClick={() => updateStatus(request.id, "approved")}>
                    <Check data-icon="inline-start" /> অনুমোদন
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            এখন কোনো অপেক্ষমাণ অনুরোধ নেই।
          </div>
        )}
        {pendingCount > pageSize ? (
          <nav aria-label="অনুরোধের পৃষ্ঠা" className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {((currentRequestPage - 1) * pageSize + 1).toLocaleString("bn-BD")}–
              {Math.min(currentRequestPage * pageSize, pendingCount).toLocaleString("bn-BD")} /{" "}
              {pendingCount.toLocaleString("bn-BD")}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentRequestPage === 1}
                onClick={() => setRequestPage((value) => Math.max(1, value - 1))}
                aria-label="আগের পৃষ্ঠা"
              >
                <ChevronLeft /> আগের
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentRequestPage === pageCount}
                onClick={() => setRequestPage((value) => Math.min(pageCount, value + 1))}
                aria-label="পরের পৃষ্ঠা"
              >
                পরের <ChevronRight />
              </Button>
            </div>
          </nav>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">ডেমো: অনুমোদন বা প্রত্যাখ্যানের অবস্থা শুধু এই পেজে থাকবে।</p>
      </section>
    </div>
  );
}
