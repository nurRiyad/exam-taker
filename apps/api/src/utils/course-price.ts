import { formatSqliteTimestamp } from "./sqlite-time";

type CoursePricing = {
  basePriceBdt: number;
  discountPercent: number | null;
  discountStartAt: string | null;
  discountEndAt: string | null;
};

/** Applies an active percentage discount window to a course's list price at
 * join time ("price_snapshot_bdt = current effective price incl. active
 * discount", docs/implementation-plan.md Step 4). A discount is active only
 * while `now` falls within [discountStartAt, discountEndAt]; an unset bound
 * on either side leaves that side open-ended. Timestamps are compared as
 * SQLite's `YYYY-MM-DD HH:MM:SS` strings, which sort lexicographically in
 * chronological order (see sqlite-time.ts). */
export function computeEffectivePriceBdt(course: CoursePricing, now: Date): number {
  const nowStr = formatSqliteTimestamp(now);
  const discountActive =
    course.discountPercent != null &&
    (!course.discountStartAt || course.discountStartAt <= nowStr) &&
    (!course.discountEndAt || course.discountEndAt >= nowStr);

  if (!discountActive) return course.basePriceBdt;
  return Math.round(course.basePriceBdt * (1 - course.discountPercent! / 100) * 100) / 100;
}
