export type FieldErrors = Record<string, string>;

/** Extracts a display-ready error message (and any field-level errors) from a
 * non-ok API response. Structured `{ error, fields }` bodies (e.g. signup
 * conflicts) surface their fields; a raw ZodError body (a client bypassing
 * our own validation) falls back to a generic message. */
export async function extractApiError(
  res: Response,
  fallback: string,
): Promise<{ message: string; fields?: FieldErrors }> {
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object") {
      const { error, fields } = body as { error?: unknown; fields?: FieldErrors };
      if (typeof error === "string") return { message: error, fields };
      if (error && typeof error === "object" && (error as { name?: string }).name === "ZodError") {
        return { message: "Please check the highlighted fields." };
      }
    }
  } catch {
    // Non-JSON body — fall through to the generic fallback below.
  }
  return { message: fallback };
}
