# Implementation Plan (Backend → Frontend)

This doc elaborates `docs/build-plan.md`'s Steps 3–13 into concrete backend endpoints/files and frontend pages/components, and tracks fine-grained status. It does not replace `build-plan.md` — that doc remains the authoritative step sequence and exit criteria; this doc is the "how" underneath each step.

**Working rule** (per the team's stated execution order): for each step, finish and verify the **Backend** track completely — implement, `/code-review`, and exercise with the `run`/`verify` skill against a live dev server — before starting that step's **Frontend** track. Don't jump ahead to a later step's backend while an earlier step's frontend is still outstanding, per `CLAUDE.md`.

Status legend: ✅ Done · 🚧 Partial · ⬜ Not started.

**Progress: 4 of 14 steps (0–13) done — Steps 0, 1, 2, 3 — plus Step 4's Backend track done.** Step 2's local-dev scope is fully done; its one remaining item (real Cloudflare D1/KV resources, Vercel/Cloudflare account access, prod `JWT_SECRET`) needs the project owner's own account access, and is being done now (ahead of Step 13) alongside the CI/CD + hosting setup — see ADR-0063/ADR-0064. Step 3's auth is being revised in place from an httpOnly cookie to a bearer token (ADR-0064) since frontend/API now live on different registrable domains (`*.vercel.app` / `*.workers.dev`). Step 4's Frontend track and Steps 5–13 are not started beyond a placeholder route-shell scaffold.

Every table/field name below is taken directly from the current `apps/api/src/db/schema.ts` / `docs/data-model.md` — the schema already covers the entire MVP, so **no step below is expected to need a new migration** unless an implementation surfaces a genuine gap (none known today). If one does, follow `.claude/skills/d1-schema` and note the new migration number here.

---

## Current State Snapshot (Steps 0–2)

### Step 0 — Product/architecture decisions — ✅ Done
All of `docs/adr/0001`–`0061`, `docs/data-model.md`, `docs/glossary.md`, `docs/mvp-spec.md`, `docs/product-brief.md`, `docs/technical-design.md`, `docs/build-plan.md` are written and internally consistent. This plan treats them as fixed inputs.

### Step 1 — Data model → D1 schema — ✅ Done
`apps/api/migrations/0001_init.sql` and `apps/api/src/db/schema.ts` define all 17 tables the MVP needs, already applied to local D1:

`tenants`, `users`, `teacher_memberships`, `courses`, `course_enrollments`, `payment_access_requests`, `course_billing_rates`, `invoices`, `exam_topics`, `exams`, `questions`, `exam_question_links`, `question_tags`, `exam_attempts`, `attempt_items`, `weak_zone_snapshots`, `reset_codes`.

Includes the one-live-attempt-per-student partial unique index, enum `CHECK` constraints, and FK relationships across the whole model. Later steps consume this schema; they don't extend it.

### Step 2 — Repo & infra scaffold — ✅ Done (local dev; real Cloudflare resources/domain deferred to Step 13)
**Done:** pnpm workspace root, `apps/api` Hono skeleton (`GET /health` querying D1 via Drizzle, exports `AppType`), `apps/web` Next.js 16 App Router + Tailwind v4 scaffold with a placeholder homepage, `next.config.ts` dev-time `/api/*` rewrite to the API worker, `.nvmrc` pinning Node `24.14.1`.

**Deferred (pulled forward into the steps below):**
| Item | Where it lands | Status |
|---|---|---|
| `wrangler secret put JWT_SECRET` (prod); confirm local `.dev.vars` value | Step 3 backend | ✅ local `.dev.vars` confirmed working (live-verified); prod secret still open — lands with Step 13's real-deploy setup |
| shadcn/ui `init` (no `components.json` yet) | Step 3 frontend (first real UI needed) | ✅ Done (`base-nova`/Base UI style) |
| `drizzle-kit generate` baseline snapshot (no journal yet — `0001_init.sql` is hand-written) | Do once, before the first time any step actually needs a schema change | ✅ Done — `apps/api/migrations/0002_drizzle_baseline.sql` (all statements `IF NOT EXISTS`, safely no-ops on the already-migrated local D1); a follow-up `db:generate` confirmed zero drift. Real migrations resume at `0003`. See `.claude/skills/d1-schema/SKILL.md`. |
| Real Cloudflare resource IDs (`wrangler d1 create`, `wrangler kv namespace create`), Vercel project for `apps/web`, `wrangler secret put JWT_SECRET` (prod), GitHub Actions secrets | Not tied to a specific step — brought forward from Step 13 to now (ADR-0063) | ⬜ **Blocked on the project owner**: needs `wrangler login` and a Vercel account/project connection — not something that can be done from this environment autonomously. No domain-name decision needed — shipping on free default domains (ADR-0063). |
| Next.js 16 `proxy.ts` convention (replaces `middleware.ts`) | Step 3 frontend (first route guards) | ✅ Done |

---

## Step 3 — Auth vertical slice — ✅ Done (Backend ✅, Frontend ✅); auth transport revised to bearer token (ADR-0064)
ADRs: [0054](adr/0054-jwt-auth-with-pbkdf2-password-hashing.md), [0064](adr/0064-bearer-token-auth-default-domains.md), [0020](adr/0020-password-login-without-otp.md), [0025](adr/0025-manual-password-reset-codes.md), [0017](adr/0017-global-student-account.md), [0049](adr/0049-fast-signup-with-unique-identity.md)

### Backend
Tables: `users`, `reset_codes`.

New files:
- `apps/api/src/lib/password.ts` — PBKDF2-SHA256 hash/verify via Web Crypto, encoded as `pbkdf2$<iterations>$<salt>$<hash>` (ADR-0054).
- `apps/api/src/lib/jwt.ts` — HS256 sign/verify only (no cookie helpers), 30-day flat expiry, no refresh flow (ADR-0054, ADR-0064).
- `apps/api/src/middleware/auth.ts` — reads the `Authorization: Bearer` header, verifies the JWT, then **re-loads the user + role from the DB** (JWT claims are UI convenience only, ADR-0054) and attaches to Hono context; exports a `requireRole(...)` guard factory.
- `apps/api/src/middleware/error-handler.ts` — first use; generic error responses (no stack traces / SQL errors leaked — full audit deferred to Step 13, but shape it correctly now).
- `apps/api/src/validation/auth.ts` — Zod schemas: `signupSchema`, `loginSchema`, `generateResetCodeSchema`, `redeemResetCodeSchema`.
- `apps/api/src/routes/auth.ts` — mounted in `src/index.ts`.

Endpoints:
| Method | Path | Auth | Request body | Response | Key rules |
|---|---|---|---|---|---|
| GET | `/auth/username-availability` | none | query `?username=` | `{ available: boolean }` | Live check while typing (ADR-0049) |
| POST | `/auth/signup` | none | `name, username, phone (local 01...), email, password, passwordConfirmation` | `{ user, token }` | One screen, no optional fields (ADR-0049); username/phone/email uniqueness; normalize phone to `+880...` for storage; username starts with a letter, ≥3 chars, letters/numbers/underscores; password ≥6 chars, no composition rule |
| POST | `/auth/login` | none | `identifier (username\|phone\|email), password` | `{ user, token }` | Vague error on any failure, never reveals which field was wrong (ADR-0020) |
| POST | `/auth/logout` | bearer | — | `204` | No server-side revocation (ADR-0054); client discards the token/cookie |
| GET | `/auth/me` | bearer | — | `{ user }` or `401` | Frontend session bootstrap |
| POST | `/auth/reset-codes` | teacher/admin | `{ userId }` | `{ code }` (plaintext, shown once) | Hash stored, `expires_at` = +1h, delivered manually outside the platform (ADR-0025). **Resolved in Step 4**: teacher-generated codes now require the target student to have a non-`removed` `course_enrollments` row in one of the teacher's own courses (admins are exempt, having no tenant of their own); see Step 4's backend section below. |
| POST | `/auth/reset` | none | `{ identifier, code, newPassword, newPasswordConfirmation }` | `{ ok: true }` | Verifies hash + not expired + not used; marks `used_at` |

Verification: `curl`/`run` skill through the sequence signup → logout (discard token) → login → generate reset code (as a manually-seeded teacher row) → reset password → login with new password.

### Frontend (after backend above is done) — ✅ Done
New files:
- `apps/web/components.json` + `apps/web/src/components/ui/*` — shadcn `init`, first components: `button`, `input`, `label`, `card`. **Deviation from the original plan**: shadcn was initialized with the new Base UI style (`base-nova`, the CLI's now-recommended default over Radix), whose registry doesn't yet ship a `form` component (the registry entry exists but is an empty stub — no files). Forms are built with plain controlled `<input>`s + `Label`/`Input`/`Button`/`Card` and hand-rolled client-side validation instead, matching Next.js's own plain-form guidance. Revisit if/when shadcn ships a Base UI `form` component and a real need for its extra ergonomics shows up.
- `apps/web/src/lib/api-client.ts` — `hc<AppType>()` instance pointed at `/api`, attaching `Authorization: Bearer <token>` (read from the `session_token` cookie) to every call (ADR-0064; frontend/API are cross-origin by default now, not same-origin). The type-only cross-package import needed two small additions not in the original plan: `apps/web/package.json` gets `api: "workspace:*"` as a devDependency, and `apps/web/src/types/api-ambient-shim.d.ts` declares loose `Env`/`D1Database` ambients so the import resolves — deliberately *not* including apps/api's real `worker-configuration.d.ts`, since that file also redefines the global `Response`/`fetch` to Cloudflare's Workers-flavored shapes, which would conflict with Hono's browser-flavored RPC client types across the whole Next.js app.
- `apps/web/src/proxy.ts` — Next.js 16 route-guard convention; reads the `session_token` cookie and calls the API's `/auth/me` directly against `API_INTERNAL_URL` with an `Authorization: Bearer` header (server-side, bypassing the `/api/*` rewrite — see `docs/technical-design.md`'s Local Development section) and enforces role match server-side, never trusting a client-side JWT decode. Gates by **literal path**, not by route-group prefix — `(student)`/`(teacher)`/`(admin)` are organizational only and don't appear in the URL (see the Pages note below), so the guard is a small `path -> allowed roles[]` map, extended as new gated pages land in later steps.

Pages:
| Route | Purpose | Key components | API calls | Notes |
|---|---|---|---|---|
| `(public)/signup/page.tsx` | One-screen signup form | `Input`, `Label`, `Card`, live-availability hint | `GET /auth/username-availability`, `POST /auth/signup` | ADR-0049 |
| `(public)/login/page.tsx` | Login form | `Input`, `Label`, `Card` | `POST /auth/login` | Vague error display (ADR-0020) |
| `(public)/reset/page.tsx` | Redeem a reset code | `Input`, `Label`, `Card` | `POST /auth/reset` | |
| `(teacher)/reset-codes/page.tsx` | Generate a code for a student (support flow) | shared `ResetCodeForm` component | `POST /auth/reset-codes` | **Deviation from the original plan**: route groups don't add path segments, so a separate `(teacher)/reset-codes/page.tsx` and `(admin)/reset-codes/page.tsx` would both resolve to the same literal URL (`/reset-codes`) and collide at build time. Built as **one page**, physically under `(teacher)/`, that both `teacher` and `admin` roles can reach — gated by `src/proxy.ts`'s `ROUTE_ROLES` map, not by which route group the file lives in. Minimal now (raw student-ID input); full lookup UI comes in Step 12 |

Verification: exercised end-to-end with a headless-browser script against both dev servers — signup (with live username-availability), a student redirected away from `/reset-codes` (role guard), logout/login, wrong-password shows the vague error, admin login + `/reset-codes` access + code generation, redeeming the code on `/reset`, old password rejected and new password accepted. All steps passed; this is build-plan's own Step 3 exit criteria.

---

## Step 4 — Tenant, course, and access workflow — 🚧 Partial (Backend ✅, Frontend ⬜)
ADRs: [0052](adr/0052-single-shared-multi-tenant-deployment.md), [0058](adr/0058-course-route-minimum-publish-fields.md), [0048](adr/0048-login-required-course-join.md), [0011](adr/0011-locked-exams-before-payment-approval.md), [0026](adr/0026-one-by-one-payment-approval.md), [0046](adr/0046-course-exam-topics.md)

### Backend — ✅ Done
Tables: `tenants`, `teacher_memberships`, `courses`, `exam_topics`, `course_enrollments`, `payment_access_requests`.

New files: `apps/api/src/routes/admin.ts` (tenant creation, first use), `apps/api/src/routes/courses.ts`, `apps/api/src/routes/exam-topics.ts`, `apps/api/src/middleware/tenant-scope.ts` (first use — every query below must filter by the caller's `tenant_id`/course membership), `apps/api/src/validation/{courses,exam-topics}.ts`.

Endpoints:
| Method | Path | Auth | Request body | Response | Key rules |
|---|---|---|---|---|---|
| POST | `/admin/tenants` | admin | `name, slug, ownerUserId` | `{ tenant }` | Admin-created in MVP (build-plan Step 4); creates owning `teacher_memberships` row |
| PATCH | `/teacher/tenant` | teacher (own tenant) | `logoUrl?, bannerUrl?, brandColor?, teacherPictureUrl?` | `{ tenant }` | Branding self-service |
| POST | `/courses` | teacher | `title, shortDescription, fullSyllabus, basePriceBdt, isFree, discountPercent?, discountStartAt?, discountEndAt?` | `{ course }` | Tenant-scoped |
| PATCH | `/courses/:id` | teacher (own) | any course field | `{ course }` | `basePriceBdt` becomes immutable once ≥1 `course_enrollments` row exists (product default) |
| POST | `/courses/:id/publish` | teacher (own) | — | `{ course }` | Requires `title`, `short_description`, price/free status, ≥1 exam topic with `title`+`short_description`+`scheduled_at` (ADR-0058) |
| GET | `/courses/:id` | role-scoped | — | `{ course, examTopics[] }` | |
| GET | `/teacher/courses` | teacher | — | `{ courses[] }` | Own tenant only |
| POST | `/exam-topics` | teacher (own course) | `courseId, title, shortDescription, scheduledAt, sortOrder?` | `{ examTopic }` | |
| PATCH | `/exam-topics/:id` | teacher (own) | any field | `{ examTopic }` | |
| POST | `/courses/:id/join` | student | — | `{ enrollment }` | Login required even for free courses (ADR-0048); free → `access_status='approved'` auto; paid → `'joined_pending_payment'`; `price_snapshot_bdt` = current effective price incl. active discount |
| POST | `/courses/:id/payment-requests` | student | `{ transactionId }` | `{ paymentAccessRequest }` | status `'pending'` |
| GET | `/teacher/courses/:id/payment-requests` | teacher (own) | query `?status=` | `{ requests[] }` | |
| POST | `/payment-requests/:id/approve` | teacher (own) | — | `{ request, enrollment }` | One by one (ADR-0026); sets enrollment `'approved'`, stamps `reviewed_by_user_id`/`reviewed_at` |
| POST | `/payment-requests/:id/reject` | teacher (own) | — | `{ request }` | |
| POST | `/enrollments/:id/block` | teacher (own) | — | `{ enrollment }` | `access_status='blocked'`, `blocked_at` |
| POST | `/enrollments/:id/remove` | teacher (own) | — | `{ enrollment }` | `access_status='removed'`; blocks future access only — past results stay visible (ADR-0011) |
| PATCH | `/auth/reset-codes` scoping *(revisit existing Step 3 endpoint, not a new route)* | teacher/admin | — | — | Now that `course_enrollments` exists, tighten Step 3's `POST /auth/reset-codes` to require the target student be enrolled in one of the calling teacher's courses (ADR-0025) — see the flagged gap in Step 3's endpoint table above |

Verification: create a tenant + course via API, publish it, join as a student, submit a payment request, approve it — confirm `course_enrollments.access_status` transitions correctly at each step. Also confirm the tightened `/auth/reset-codes` check now rejects a teacher generating a code for a student outside their courses.

**Done** — exercised live end to end against a local dev server (`run`/`verify`): admin creates a tenant (owner promoted `student`→`teacher`, a second tenant for the same owner is rejected), teacher brands the tenant, creates a course, adds an exam topic, publish is rejected until the topic is marked `title`+`short_description`+`scheduled_at`+`status: 'published'`, a student joins the published paid course, submits a payment request, teacher approves it and `course_enrollments.access_status` flips to `approved`. Also confirmed: cross-tenant access returns 404 without leaking existence; a draft exam topic is hidden from non-owning viewers; a blocked enrollment can't self-rejoin (403) while a removed one can; approving a payment request no longer reinstates a since-blocked/removed enrollment; and the tightened `/auth/reset-codes` check rejects a teacher generating a code for a student outside their courses. `/code-review` ran at high effort and every finding it surfaced was fixed before this was marked done.

### Frontend — 🚧 Route shells only; data-backed UI not started
Canonical client routes are scaffolded with placeholder pages so navigation and guard shape can settle before real content lands. Public discovery routes stay top-level (`/`, `/courses`, `/courses/[courseId]`, `/teachers`, `/teachers/[teacherId]`, `/exams/[examId]/results`). Authenticated workspaces are role-prefixed (`/student/*`, `/teacher/*`, `/admin/*`), and `/dashboard` is a protected redirect-only entry point to the verified role dashboard. Teacher exam and exam-topic management routes are nested under `/teacher/courses/[courseId]/*` because exams cannot exist outside a course. A common mobile-first navbar/footer shell, global construction notice, simple landing page, 404 page, error page, static searchable course/teacher card grids, and static public course/teacher detail layouts are also scaffolded. These placeholders do **not** satisfy Step 4's browser exit criteria yet.

New shadcn components: `dialog`, `select`, `textarea`, `badge`, `table`, `tabs`.

Pages:
| Route | Purpose | Key components | API calls |
|---|---|---|---|
| `(admin)/tenants/page.tsx`, `.../new/page.tsx` | Create teacher/tenant | `form`, `table` | `POST /admin/tenants` |
| `(teacher)/courses/page.tsx` | List own courses | `table` | `GET /teacher/courses` |
| `(teacher)/courses/new/page.tsx` | Create course | `form` | `POST /courses` |
| `(teacher)/courses/[id]/edit/page.tsx` | Edit course, branding, inline exam-topic list/add, publish button | `form`, `dialog`, `tabs` | `PATCH /courses/:id`, `PATCH /teacher/tenant`, `POST/PATCH /exam-topics`, `POST /courses/:id/publish` |
| `(teacher)/courses/[id]/access-requests/page.tsx` | Approval queue | `table`, `badge` | `GET .../payment-requests`, `POST .../approve\|reject` |
| `(teacher)/courses/[id]/students/page.tsx` | Roster with block/remove | `table`, `dialog` | `POST /enrollments/:id/block\|remove` |
| `(student)/courses/[id]/page.tsx` | Course detail incl. join button / locked state | `card`, `badge` | `GET /courses/:id`, `POST /courses/:id/join` |
| `(student)/courses/[id]/payment/page.tsx` | Submit transaction ID | `form` | `POST /courses/:id/payment-requests` |

Verification: teacher creates a course and publishes a route with ≥1 dated exam topic; student joins, requests access, teacher approves — in the browser (build-plan Step 4 exit criteria).

---

## Step 5 — Billing — ⬜ Not started
ADRs: [0053](adr/0053-per-course-negotiated-student-invoicing.md)

### Backend
Tables: `course_billing_rates`, `invoices`.

New files: `apps/api/src/routes/billing.ts`, `apps/api/src/validation/billing.ts`.

Endpoints:
| Method | Path | Auth | Request body | Response | Key rules |
|---|---|---|---|---|---|
| POST | `/admin/courses/:id/billing-rate` | admin | `{ pricePerStudentBdt }` | `{ rate }` | Private, unrelated to `courses.base_price_bdt` |
| GET | `/admin/courses/:id/billing-rate` | admin | — | `{ rate }` | Latest rate |
| POST | `/admin/courses/:id/invoices` | admin | `{ manualAdjustmentBdt? }` | `{ invoice }` | Snapshots current approved-enrollment count × latest rate as `amount_bdt`; status `'draft'` |
| PATCH | `/admin/invoices/:id` | admin | `{ manualAdjustmentBdt?, status? }` | `{ invoice }` | Lifecycle `draft → sent → paid/void`; stamps `sent_at`/`paid_at` on transition |
| GET | `/admin/invoices` | admin | query `?tenantId=&courseId=&status=` | `{ invoices[] }` | |

Verification: generate an invoice for a course with enrolled students, confirm `student_count_snapshot`/`amount_bdt` match the approved-enrollment count × rate, then mark it paid.

### Frontend
Pages:
| Route | Purpose | Key components | API calls |
|---|---|---|---|
| `(admin)/billing/page.tsx` | List all invoices | `table`, `badge` | `GET /admin/invoices` |
| `(admin)/courses/[id]/billing/page.tsx` | Set rate, generate invoice, transition status | `form`, `dialog` | all `/admin/.../billing-rate` and `/admin/.../invoices` endpoints |

Verification: admin generates an invoice for a course with enrolled students and manually marks it paid (build-plan Step 5 exit criteria).

---

## Step 6 — Question bank and exam authoring — ⬜ Not started
ADRs: [0050](adr/0050-flat-question-tag-taxonomy.md), [0019](adr/0019-csv-xlsx-question-import.md), [0022](adr/0022-official-question-import-template.md), [0030](adr/0030-question-answer-attached-to-question.md), [0056](adr/0056-lock-exam-settings-after-publish.md), [0055](adr/0055-shared-question-bank-with-exam-links.md), [0023](adr/0023-exam-duplication-counts-as-new-exam.md), [0003](adr/0003-question-entry-is-a-core-product-surface.md), [0029](adr/0029-content-responsibility-before-upload.md)

### Backend
Tables: `questions`, `question_tags`, `exams`, `exam_question_links`.

New files: `apps/api/src/routes/questions.ts`, `apps/api/src/routes/exams.ts`, `apps/api/src/validation/{questions,exams}.ts`. This is the first step to actually need `drizzle-kit generate` exercised (per the Step 2 deferred item) *only if* a real gap in `schema.ts` turns up — expected not to, since the schema already models everything here.

Endpoints:
| Method | Path | Auth | Request body | Response | Key rules |
|---|---|---|---|---|---|
| POST | `/questions` | teacher/admin | full `Question` fields + `tags[]` | `{ question }` | Requires the one-time content-responsibility confirmation to have been accepted for the account (ADR-0029) |
| GET | `/questions` | teacher/admin | query `?subject=&tag=&reuseScope=` | `{ questions[] }` | Teacher sees `platform_reusable` + own tenant's `teacher_private` |
| PATCH | `/questions/:id` | owner tenant (private) / admin (reusable) | any field | `{ question }` | |
| POST | `/questions/import` | teacher/admin | multipart CSV | `{ imported: number, errors: [{row, message}] }` | Official template columns: `question_text, option_a, option_b, option_c, option_d, correct_option, explanation, subject, tags, exam_name, exam_year, post_name, institution, source, reuse_scope`; row-level errors, answer required, explanation optional (ADR-0019/0022) |
| GET | `/questions/import/template` | teacher/admin | — | CSV file | Serves the official template |
| GET | `/questions/export.csv` | teacher/admin | — | CSV file | Question-set export/backup path (mvp-spec) |
| POST | `/exams` | teacher (own course) | `examTopicId, title, description?, startsAt, endsAt, durationMinutes(default 50), negativeMarkingEnabled(default false), negativeMarkPerWrong?, answerChangeAllowed(default true), autosaveEnabled(default true), mockEnabled(default false), mockRetryLimit?, resultReleaseMode(default 'automatic')` | `{ exam }` | status `'draft'` |
| PATCH | `/exams/:id` | teacher (own) | any field | `{ exam }` | Only while `status='draft'` (ADR-0056) |
| POST | `/exams/:id/questions` | teacher (own) | `{ questionIds: [], sortOrder? }` | `{ links[] }` | Draft only; `teacher_private` questions must belong to the exam's tenant |
| DELETE | `/exams/:id/questions/:linkId` | teacher (own) | — | `204` | Draft only |
| POST | `/exams/:id/publish` | teacher (own) | — | `{ exam }` | Validates every linked question has `correct_option` set and ≥1 question linked (ADR-0030); sets `status='published'`, `published_at`, computes `total_marks`; fully immutable after (ADR-0056) — reverting to draft only allowed with zero attempts |
| POST | `/exams/:id/duplicate` | teacher (own) | — | `{ exam }` | New draft copy; `platform_reusable` links re-point to same `question_id`, `teacher_private` links copy the `Question` row first (ADR-0055/0023) |

Verification: import 50 questions via CSV, assemble an exam from them, publish it; confirm publishing a second time and editing after publish are both rejected (build-plan Step 6 exit criteria).

### Frontend
New shadcn components: `command`/combobox (question picker), a data-table pattern, `alert-dialog` (publish confirmation), a file-upload input.

Pages:
| Route | Purpose | Key components | API calls |
|---|---|---|---|
| `(teacher)/questions/page.tsx` | Browse/search/filter bank | data-table, `select` (subject/tag filter) | `GET /questions` |
| `(teacher)/questions/new/page.tsx` | Fast manual entry (mobile/keyboard-friendly, ADR-0003) | `form` | `POST /questions` |
| `(teacher)/questions/import/page.tsx` | CSV upload + template download + row-error display | file input, `table` for errors | `GET .../template`, `POST /questions/import` |
| `(teacher)/courses/[courseId]/exams/page.tsx`, `.../new/page.tsx` | List / create exams inside a course | `table`, `form` | `GET/POST /exams` |
| `(teacher)/courses/[courseId]/exams/[id]/build/page.tsx` | Link questions, reorder, publish, duplicate | combobox picker, `alert-dialog` | `POST/DELETE .../questions`, `POST .../publish`, `POST .../duplicate` |

Verification: same as backend exit criteria, driven through the browser end to end.

---

## Step 7 — Exam attempt-taking flow — ⬜ Not started (highest risk — own focused pass, per `CLAUDE.md`)
ADRs: [0033](adr/0033-shuffle-questions-and-options-by-default.md), [0037](adr/0037-configurable-answer-change-and-autosave.md), [0038](adr/0038-internet-drop-does-not-pause-exam.md), [0040](adr/0040-warn-before-leaving-exam-page.md), [0036](adr/0036-auto-submit-on-timeout.md), [0041](adr/0041-submit-confirmation-and-unanswered-count.md), [0039](adr/0039-live-one-attempt-mock-multiple-retries.md), [0016](adr/0016-configurable-negative-marking.md), [0002](adr/0002-mobile-first-exam-experience.md)

### Backend
Tables: `exam_attempts`, `attempt_items`.

New files: `apps/api/src/routes/attempts.ts`, `apps/api/src/validation/attempts.ts`, `apps/api/src/lib/shuffle.ts` (deterministic-once shuffle used at attempt creation only).

Endpoints:
| Method | Path | Auth | Request body | Response | Key rules |
|---|---|---|---|---|---|
| POST | `/exams/:id/attempts` | student (approved enrollment) | — | `{ attempt, items[] }` (no `correct_option_snapshot` in response) | Requires `exam.status='published'`, now within `starts_at`/`ends_at`; DB partial unique index blocks a 2nd `live` attempt; shuffles question order + each question's option order and writes `attempt_items` snapshots (`question_text_snapshot`, `options_snapshot`, `correct_option_snapshot`, `display_order`, `option_order`) — order is fixed from here on (ADR-0033) |
| GET | `/attempts/:id` | owner student | — | `{ attempt, items[], remainingSeconds }` | Rehydrates state on refresh; `remainingSeconds` computed server-side from `started_at + duration_minutes`, not trusted from the client; if `remainingSeconds<=0` and still `in_progress`, force-submits first (see Notes) |
| PATCH | `/attempts/:id/items/:itemId` | owner student | `{ selectedOption }` | `{ item }` | Autosave; if `exam.answer_change_allowed=false`, reject a change to an already-answered item (ADR-0037) |
| POST | `/attempts/:id/submit` | owner student or system | `{ autoSubmitted?: boolean }` | `{ attempt }` | Scores each item using `exam.negative_marking_enabled`/`negative_mark_per_wrong` (ADR-0016), sums `score`, sets `submitted_at`/`duration_seconds`/`status='submitted'`; `rank` stays null here — computed at result release (Step 8) |

Notes: Workers have no background cron in this stack yet, so timeout auto-submit is enforced two ways: (1) the client fires `POST /attempts/:id/submit` itself when its countdown hits zero, and (2) as a defensive backstop, `GET /attempts/:id` (and the autosave/submit endpoints) check `now > started_at + duration_minutes` first and force-submit server-side before doing anything else, so a dead client can't leave an attempt stuck `in_progress` forever.

Verification: via `run`/`verify` — start an attempt, confirm shuffle order is stable across two `GET /attempts/:id` calls, autosave an answer, let the clock run past `duration_minutes` and confirm the next `GET` force-submits it.

### Frontend
New shadcn components: `radio-group` (options), `progress` (timer), `alert-dialog` (submit confirmation), `toast` (autosave/connection feedback).

Pages:
| Route | Purpose | Key components | API calls | UX rules |
|---|---|---|---|---|
| `(student)/exams/[id]/attempt/page.tsx` | The exam-taking screen | `radio-group`, `progress`, `alert-dialog`, connection badge | `POST .../attempts`, `GET/PATCH /attempts/:id`, `POST .../submit` | Autosave on select (ADR-0037); client-computed countdown resynced against server `remainingSeconds`; auto-submit dispatch at zero (ADR-0036); `navigator.onLine` + failed-fetch connection indicator (ADR-0038); `beforeunload` leave-warning, normal in-page navigation unaffected (ADR-0040); submit confirmation shows unanswered count (ADR-0041); mobile-first layout, large tap targets (ADR-0002) |

Verification: build-plan's own exit criteria, driven live — take a full mock-of-a-live exam on a throttled mobile viewport: start, answer some questions, refresh mid-attempt (confirm order and saved answers survive), let the timer expire and confirm auto-submit actually happens.

---

## Step 8 — Results and leaderboard — ⬜ Not started
ADRs: [0010](adr/0010-result-release-mvp.md), [0021](adr/0021-leaderboard-tie-rule.md), [0018](adr/0018-full-named-leaderboard.md), [0045](adr/0045-no-result-recalculation-in-mvp.md), [0042](adr/0042-teacher-sees-live-result-only.md)

### Backend
No new tables — reads `exam_attempts` written in Step 7.

New files: `apps/api/src/lib/ranking.ts` (score desc, `duration_seconds` asc tiebreak, shared-rank-for-ties per ADR-0021).

Endpoints:
| Method | Path | Auth | Request body | Response | Key rules |
|---|---|---|---|---|---|
| GET | `/exams/:id/results` | enrolled student / teacher (own) | — | `{ released: boolean, releaseAt? }` or the full result set | Lazily finalizes ranks (writes `exam_attempts.rank` for all `submitted` live attempts of this exam) the first time `now >= result_release_at` (default 5 min after `ends_at`) or a manual release has been triggered — no separate cron needed; once finalized, immutable (ADR-0045) |
| POST | `/exams/:id/release` | teacher (own) | — | `{ released: true }` | Only valid if `exam.result_release_mode='manual'` |
| GET | `/exams/:id/leaderboard` | enrolled student / teacher (own) | — | `{ entries: [{ name, score, rank }] }` | Name/score/rank only, no phone/email (ADR-0018); teacher view is live-attempt-only, never mock (ADR-0042) |
| GET | `/attempts/:id/result` | owner student | — | `{ score, rank, items: [{ questionTextSnapshot, options, selectedOption, correctOption, explanation }] }` | Only after release |

Verification: let a real exam's `ends_at` pass, confirm results release automatically ~5 minutes later, and construct a tied-score scenario to confirm shared rank + time-based ordering.

### Frontend
Pages:
| Route | Purpose | Key components | API calls |
|---|---|---|---|
| `(student)/exams/[id]/result/page.tsx` | Score, rank, per-question answer review | `card`, `badge` | `GET /exams/:id/results`, `GET /attempts/:id/result` |
| `(student)/exams/[id]/leaderboard/page.tsx`, `(teacher)/courses/[courseId]/exams/[id]/leaderboard/page.tsx` | Full leaderboard | `table`, `avatar` | `GET /exams/:id/leaderboard` |

Verification: after an exam ends, confirm results release on schedule and the leaderboard renders correctly for a tied-score scenario (build-plan Step 8 exit criteria).

---

## Step 9 — Mock attempts and weak-zone analytics — ⬜ Not started
ADRs: [0009](adr/0009-live-window-plus-mock-attempts.md), [0039](adr/0039-live-one-attempt-mock-multiple-retries.md), [0042](adr/0042-teacher-sees-live-result-only.md), [0028](adr/0028-weak-zone-after-every-exam.md), [0032](adr/0032-weak-zone-visibility.md)

### Backend
Tables: `exam_attempts` (`attempt_type='mock'`), `weak_zone_snapshots`.

New files: `apps/api/src/lib/weak-zone.ts` (aggregation job logic, called inline after a qualifying submit — no separate worker needed at this scale).

Endpoints:
| Method | Path | Auth | Request body | Response | Key rules |
|---|---|---|---|---|---|
| POST | `/exams/:id/mock-attempts` | student | — | `{ attempt, items[] }` | Only if `exam.mock_enabled` and the exam's live results are already released (ADR-0009/0039); `attempt_number` increments per student/exam; rejected once `mock_retry_limit` reached if set; reuses Step 7's start/submit/autosave endpoints with `attemptType='mock'` |
| POST | `/attempts/:id/submit` (reused) | student | — | `{ attempt }` | For `mock`: shows correct answers immediately, never computes `rank`/leaderboard entry (ADR-0042) |
| PATCH | `/attempts/:id/mock-consent` | owner student | `{ consent: boolean }` | `{ attempt }` | Unchecked by default, student-controlled only (ADR-0028) |
| GET | `/students/:id/weak-zones` | self / teacher (enrolled-in-own-course only) / admin | — | `{ zones: [{ subject, tag, attemptsCount, questionsCount, correctCount, accuracyPercent }] }` | Scoped strictly by relationship (ADR-0032) — every teacher query here must filter by course enrollment |

Weak-zone recompute rule: after a `live` attempt submit, and after a `mock` attempt submit **only if** `mock_analytics_consent=true`, upsert `weak_zone_snapshots` rows per `(student_user_id, tenant_id, course_id, subject, tag)` by joining `attempt_items` → `exam_question_links` → `question_tags`.

Verification: submit a live attempt and confirm the student's weak-zone snapshot updates; submit a mock attempt without consent and confirm it does not.

### Frontend
Pages:
| Route | Purpose | Key components | API calls |
|---|---|---|---|
| `(student)/exams/[id]/mock/page.tsx` | List own mock attempts, start a new one, consent checkbox | `table`, checkbox | `POST .../mock-attempts`, `PATCH .../mock-consent`; reuses Step 7's attempt page with `attemptType=mock` |
| `(student)/weak-zones/page.tsx` | Student's own weak-zone report | chart/list | `GET /students/:id/weak-zones` |
| `(teacher)/students/[id]/weak-zones/page.tsx` | Teacher's per-student view (own enrolled students only) | chart/list | `GET /students/:id/weak-zones` |

Verification: build-plan Step 9 exit criteria in the browser — weak-zone report updates after a live attempt, unaffected by a non-consented mock attempt.

---

## Step 10 — Print/PDF export — ⬜ Not started
ADRs: [0027](adr/0027-bangla-print-quality-and-watermark.md), [0057](adr/0057-print-pdf-without-headless-browser.md)

### Backend
New files: `apps/api/src/lib/pdf.ts` (shared `pdf-lib` layout helpers), a bundled Bangla-capable font asset (e.g. Noto Sans Bengali) embedded per ADR-0057.

Endpoints:
| Method | Path | Auth | Response | Key rules |
|---|---|---|---|---|
| GET | `/exams/:id/export/question-paper.pdf` | teacher (own) / admin | PDF | Question paper only, no answers; teacher + platform watermark (ADR-0027) |
| GET | `/exams/:id/export/answer-key.pdf` | teacher (own) / admin | PDF | Includes correct answers + explanations |
| (reused) | `GET /questions/export.csv` | teacher/admin | CSV | Already defined in Step 6 |

Verification: export a real Bangla-heavy exam to PDF and visually confirm layout/watermark quality (build-plan Step 10 exit criteria — a visual check, not just an HTTP 200).

### Frontend
Pages/additions:
| Route | Purpose | API calls |
|---|---|---|
| `(teacher)/courses/[courseId]/exams/[id]/export/page.tsx` (or a section on `.../build/page.tsx`) | Download links/buttons for question paper and answer key | `GET .../export/question-paper.pdf`, `GET .../export/answer-key.pdf` |
| Button on `(teacher)/questions/page.tsx` | Export bank as CSV | `GET /questions/export.csv` |

---

## Step 11 — Public teacher and course pages — ⬜ Not started
ADRs: [0044](adr/0044-public-past-exam-list-locked-results.md), [0052](adr/0052-single-shared-multi-tenant-deployment.md)

### Backend
New files: `apps/api/src/routes/public.ts` (no auth middleware).

Endpoints:
| Method | Path | Auth | Response | Key rules |
|---|---|---|---|---|
| GET | `/public/teachers/:slug` | none | `{ tenant, courses[] }` | Branding + published course list (title, short description, price/free/discount) |
| GET | `/public/courses/:id` | none | `{ course, examTopics[], pastExams[] }` | `full_syllabus` shown to everyone; past exams show syllabus, live participant count, top score+username to everyone (ADR-0044) |
| GET | `/public/courses/:id/exams/:examId/summary` | none | `{ title, scheduledMetadata, priceIfLocked }` | For non-enrolled visitors: locked-exam CTA shows exact price + join instructions, no result/leaderboard detail (ADR-0044) |

Verification: log out and hit these endpoints anonymously; confirm locked content never leaks result/leaderboard data.

### Frontend
Pages:
| Route | Purpose | Key components | API calls |
|---|---|---|---|
| `(public)/[teacherSlug]/page.tsx` | Public teacher page | branding header, course cards | `GET /public/teachers/:slug` |
| `(public)/[teacherSlug]/courses/[courseId]/page.tsx` | Course detail + past-exam list, locked cards + CTA for non-enrolled | `card`, `badge` | `GET /public/courses/:id` |

Verification: browse a teacher's public page as an anonymous visitor; confirm locked content behaves per ADR-0044 (build-plan Step 11 exit criteria).

---

## Step 12 — Admin support tooling — ⬜ Not started
ADRs: [0015](adr/0015-admin-support-impersonation.md), [0025](adr/0025-manual-password-reset-codes.md)

### Backend
New endpoints in `apps/api/src/routes/admin.ts`:
| Method | Path | Auth | Response | Key rules |
|---|---|---|---|---|
| GET | `/admin/users` | admin | `{ users[] }` | Search by username/phone/email; read-only, no impersonation (ADR-0015) |
| GET | `/admin/users/:id` | admin | `{ user, enrollments[], teacherMemberships[], attempts[] }` | Cross-tenant, read-only |
| POST | `/admin/users/:id/reset-codes` | admin | `{ code }` | Reuses Step 3's `POST /auth/reset-codes` logic |
| (reused) | `GET /exams/:id/export/*` | admin | PDF | Admin authorized in addition to owning teacher (already scoped in Step 10) |

Verification: look up a specific student/teacher's state and generate a reset code for them, confirming no endpoint lets the admin act *as* that user.

### Frontend
Pages:
| Route | Purpose | Key components | API calls |
|---|---|---|---|
| `(admin)/support/page.tsx` | Search users | search input, `table` | `GET /admin/users` |
| `(admin)/support/users/[id]/page.tsx` | Read-only detail view, generate reset code, trigger exports | `card`, `ResetCodeForm` (from Step 3) | `GET /admin/users/:id`, `POST .../reset-codes`, export links |

Verification: admin can look up a specific student/teacher's state and generate a reset code without any action-as-that-user path existing (build-plan Step 12 exit criteria).

---

## Step 13 — Pilot hardening pass — ⬜ Not started
ADRs: [0025](adr/0025-manual-password-reset-codes.md), [0051](adr/0051-early-validation-budget-and-upgrade-policy.md), [0061](adr/0061-shadcn-tailwind-mobile-first-product-wide.md)

This step is a hardening checklist, not new endpoints/pages:

**Backend**
- [ ] Rate-limit `POST /auth/reset-codes` and `POST /admin/users/:id/reset-codes` (KV-based counter; ADR-0025).
- [ ] Full error-message audit across every route — confirm `error-handler.ts` (from Step 3) never leaks stack traces, SQL errors, or internal IDs in production responses.
- [ ] Real-Cloudflare-resources + Vercel setup, brought forward to now (ADR-0063): `wrangler d1 create`, `wrangler kv namespace create`, `wrangler secret put JWT_SECRET`, Vercel project for `apps/web`. No domain purchase needed — shipping on free default domains. **Blocked on the project owner's account access.**
- [ ] Verify actual Cloudflare **and Vercel** usage against the <2,000 BDT/month guardrail (ADR-0051, ADR-0063 — Vercel likely needs a paid plan); upgrade paid limits rather than risk a live-exam failure.

**Frontend**
- [ ] Mobile QA pass on a real low-end device / throttled connection across every flow built in Steps 3–12 — no new pages, just fixes: touch-target sizing, loading states, offline resilience (ADR-0061).

Verification: ready to run the first real pilot exam with the founder available for support, per `pilot-terms.md` (build-plan Step 13 exit criteria).
