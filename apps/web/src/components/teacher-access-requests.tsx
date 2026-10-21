"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock3, CreditCard, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AccessRequest = {
  id: string;
  student: string;
  username: string;
  courseId: string;
  batchId?: string;
  courseTitle: string;
  batchTitle: string;
  transactionId: string;
  amount: number;
  requestedAt: string;
};
type RequestState = AccessRequest & { status: "pending" | "approved" | "rejected" };

export function TeacherAccessRequests({ initialRequests }: { initialRequests: AccessRequest[] }) {
  const [requests, setRequests] = useState<RequestState[]>(() =>
    initialRequests.map((request) => ({ ...request, status: "pending" })),
  );
  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const updateStatus = (id: string, status: RequestState["status"]) =>
    setRequests((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-7 sm:px-6 sm:py-9">
      <Link
        href="/teacher/dashboard"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        ড্যাশবোর্ডে ফিরুন
      </Link>
      <header>
        <p className="text-sm font-medium text-primary">শিক্ষার্থী অ্যাক্সেস</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">ভর্তি অনুরোধ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          লেনদেন তথ্য মিলিয়ে কোর্সে অ্যাক্সেস অনুমোদন করুন। পেমেন্ট প্ল্যাটফর্মের বাইরে যাচাই করতে হবে।
        </p>
      </header>
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <Clock3 className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-amber-950">অপেক্ষমাণ অনুরোধ</p>
            <p className="text-sm text-amber-900/80">যাচাই বাকি আছে</p>
          </div>
        </div>
        <strong className="text-2xl text-amber-950">{pendingCount.toLocaleString("bn-BD")}</strong>
      </section>
      {requests.length ? (
        <div className="space-y-3">
          {requests.map((request) => (
            <Card key={request.id} className="gap-0">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <UserRound className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <CardTitle className="text-base">{request.student}</CardTitle>
                    <CardDescription>
                      @{request.username} · {request.requestedAt}
                    </CardDescription>
                  </div>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${request.status === "pending" ? "bg-amber-100 text-amber-900" : request.status === "approved" ? "bg-emerald-100 text-emerald-900" : "bg-muted text-muted-foreground"}`}
                >
                  {request.status === "pending"
                    ? "যাচাই অপেক্ষমাণ"
                    : request.status === "approved"
                      ? "অ্যাক্সেস অনুমোদিত"
                      : "অনুমোদন দেওয়া হয়নি"}
                </span>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid min-w-0 flex-1 gap-x-6 gap-y-3 rounded-xl bg-muted/40 p-3 text-sm sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">কোর্স ও ব্যাচ</p>
                    <p className="mt-1 truncate font-medium">{request.courseTitle}</p>
                    <p className="truncate text-xs text-muted-foreground">{request.batchTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">পেমেন্ট রেফারেন্স</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-medium">
                      <CreditCard className="size-4 text-muted-foreground" />
                      {request.transactionId}
                    </p>
                    <p className="text-xs text-muted-foreground">৳{request.amount.toLocaleString("bn-BD")}</p>
                  </div>
                </div>
                {request.status === "pending" ? (
                  <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="outline" onClick={() => updateStatus(request.id, "rejected")}>
                      <X data-icon="inline-start" />
                      প্রত্যাখ্যান
                    </Button>
                    <Button type="button" onClick={() => updateStatus(request.id, "approved")}>
                      <Check data-icon="inline-start" />
                      অ্যাক্সেস দিন
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="ghost" onClick={() => updateStatus(request.id, "pending")}>
                    আবার অপেক্ষমাণ করুন
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-semibold">এখন কোনো ভর্তি অনুরোধ নেই</p>
            <p className="mt-1 text-sm text-muted-foreground">নতুন অনুরোধ এলে এখানে দেখা যাবে।</p>
          </CardContent>
        </Card>
      )}
      <p className="text-xs text-muted-foreground">
        ডেমো স্ক্রিন: এই পরিবর্তনগুলো শুধু বর্তমান পেজে থাকবে; কোনো পেমেন্ট বা অ্যাক্সেস সার্ভারে পরিবর্তন করা হয় না।
      </p>
    </main>
  );
}
