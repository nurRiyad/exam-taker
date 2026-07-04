// Registered via app.onError(). Deliberate HTTPExceptions (validation failures,
// auth/role rejections, business-rule violations) pass their intended
// status+message straight through. Anything else is an unexpected bug: log it
// for observability, but never leak its message/stack to the client — full
// leak audit is Step 13, this just shapes responses correctly from the start.
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    // A route that built a structured JSON body itself (e.g. field-level
    // signup conflict errors) passed it via `options.res` — reconstruct that
    // response using *its own* status, not the outer HTTPException's. Hono's
    // own `getResponse()` does the opposite (always re-applies the outer
    // exception's status over `res`'s body), which would silently mask a
    // mismatch between the two if a route ever passed different statuses to
    // each. Deriving status from `res` alone makes that mismatch impossible.
    if (err.res) return new Response(err.res.body, { status: err.res.status, headers: err.res.headers });
    // HTTPException's own default body is plain text; wrap it in the API's
    // usual JSON error shape instead.
    return c.json({ error: err.message || "Request failed" }, err.status);
  }

  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
};
