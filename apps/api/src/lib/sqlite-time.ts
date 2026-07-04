// Every timestamp column in the schema is TEXT defaulting to SQLite's
// `datetime('now')`, which formats as `YYYY-MM-DD HH:MM:SS` (space-separated,
// UTC, second precision — no `T`, no milliseconds, no `Z`). Any timestamp the
// application computes itself (e.g. a reset code's expiry) must match that
// exact format, or lexicographic comparisons against DB-generated timestamps
// (`WHERE expires_at > ?`) silently misorder: `Date.toISOString()`'s `T`
// separator (0x54) sorts after SQLite's space (0x20) even for an earlier time
// on the same day.
export function formatSqliteTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}
