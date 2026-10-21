# UI Routes And Product Behavior

This is the route map for the current `apps/web` UI. It describes the intended user journey, the business decisions each route supports, and whether the current screen is implemented or still a placeholder. Treat it as a guide to the current UI, not as authorization to add backend behavior.

## Product decisions that shape the routes

- The product replaces coaching teachers' printed MCQ exam workflow with a branded course page, scheduled exams, rankings, and student progress views. Keep the teacher in control of course access and exam publication.
- The primary flow is **teacher page → course → batch/route → scheduled exam → result**. A batch groups a cohort, syllabus, schedule, and exams under a course; it is not a separately priced course. Course pricing is per course, free courses are allowed, and payment happens outside the platform.
- Students arrive through a teacher's own page or a direct link, then sign in and request/join a batch. Paid access is approved by the teacher; pending students must not be shown as having unlocked exams.
- Teacher-specific storefront routes (`/t/[slug]`) are the public acquisition and enrollment surface. Platform-wide teacher/course directories (`/teachers`, `/courses`, including their detail pages) are for admins and support, not a student-facing marketplace.
- Exam-taking is MCQ-first and mobile-first. The MVP defaults and policy choices for timing, autosave, answer changes, marking, result release, mock retries, and weak-zone consent are in `docs/mvp-spec.md`; UI must reflect those settings instead of inventing new policy.
- Keep user-facing UI Bangla-first per the current root and web agent instructions; the MVP spec and product brief now align with this decision.
- Billing is per course, at a negotiated per-student rate, with manual admin invoices. There is no fixed exam-pack price or exam-count allowance.

## Route map

Route groups in parentheses are Next.js organization only and do not appear in the URL. Dynamic values in brackets are route parameters.

## Intended page visibility

This is the product access model. It describes who should be able to use each page; it is not a claim that every rule is enforced in the current UI or API yet. Until authorization is implemented, treat protected routes as unfinished from an access-control perspective.

| Audience | Pages and data they can access |
| --- | --- |
| Public visitor | Landing page; a teacher's public storefront, about page, public course/batch details, published exam schedule and any leaderboard/results explicitly released as public; login, signup, and password reset. A visitor does not get exam access from seeing public course information. |
| Student | Public pages plus their own dashboard, joined/requested courses and batches, their own attempts, results, and weak-zone report. They may see a course's public information before joining. Locked exams remain unavailable until access is approved. Students cannot see another student's private progress or teacher/admin controls. |
| Teacher | Public pages plus the teacher workspace for their own tenant: their courses, batches, exams, payment/access requests, and students enrolled in those courses. They may inspect enrolled students' course activity and weak-zone details as allowed by the MVP policy. They cannot browse or manage another teacher's private roster, course, billing, or settings. |
| Admin | Platform-wide administration and support, including all teachers/tenants, courses, enrolled students, invoices, reset-code support, and read-only support views. Admin access spans tenant data for operational support; destructive or billing actions still follow their specific workflow. |

Visibility rules to carry into navigation and route work:

- Keep global `/teachers`, `/teachers/[teacherId]`, `/courses`, `/courses/[courseId]`, and `/courses/[courseId]/batches/[batchId]` inside the admin/support audience. Do not expose them as student marketplace navigation.
- Keep teacher-facing acquisition on `/t/[slug]` and its teacher-scoped profile, course, and batch pages. Those pages are public, but exam participation and private student data require the appropriate student access.
- Scope every teacher query and visible roster to the signed-in teacher's tenant and courses. Scope student views to the signed-in student's own memberships and results. Admin views can cross tenant boundaries.
- Public result visibility means the released leaderboard/summary configured for that exam; private attempt details and personal progress remain in the student's account and permitted teacher view.
- When a user is signed in, `/dashboard` routes by role. A role must not gain access merely by typing another role's URL; route guards and data authorization must enforce the same boundaries as navigation.

### Platform public and authentication

| Route | Purpose and behavior | Current UI state |
| --- | --- | --- |
| `/` | Bangla product landing page explaining the teacher value proposition and onboarding steps; links to signup and explainer content. | Implemented; content is loaded from the Hono `/home` demo endpoint. |
| `/teachers` | Admin/support teacher directory for managing the platform's teacher tenants; not a public student discovery page. | Directory implemented with local data; linked in the navbar for admin users. Admin-only access is intended and not currently enforced. |
| `/teachers/[teacherId]` | Admin/support view of a teacher profile and their courses. Students use the teacher's own `/t/[slug]` storefront instead. | Profile implemented with local data; admin-only access is intended and not currently enforced. |
| `/courses` | Admin/support course directory across tenants; not a public student marketplace. | Directory implemented with local data; linked in the navbar for admin users. Admin-only access is intended and not currently enforced. |
| `/courses/[courseId]` | Admin/support course overview and batches across tenants. | Implemented with local data; admin-only access is intended and not currently enforced. |
| `/courses/[courseId]/batches/[batchId]` | Admin/support batch overview. Student enrollment should use the matching teacher storefront batch page. | Implemented with local data; admin-only access is intended and not currently enforced. |
| `/login` | Admins and teachers sign in with email or phone and password; after sign-in they go to `/`, which routes signed-in users to their role dashboard. | Implemented; uses global database-backed accounts and `/auth/me`; ignores `next` after login. |
| `/signup` | Create a teacher account with a unique page slug, email, Bangladesh phone, and password; teacher signup creates one page. Student signup happens through a teacher's storefront. | Implemented; calls the auth API and opens a teacher session. |
| `/reset` | Set a new password with the one-time code supplied by a teacher/admin; returns to login on success. | Implemented; currently calls auth API. |
| `/reset-codes` | Compatibility entry for teachers/admins to generate a one-time code for a student. | Implemented shared form; route aliases the teacher reset-code screen. |
| `/dashboard` | Resolve the authenticated user's role and route to the admin, teacher, or student dashboard; unauthenticated users go to login. The signed-in navbar brand links here so it returns each user to their own home. | Implemented role redirect; currently calls auth API. |
| `/settings` | Signed-in account profile with view and edit states for full name, phone, division, district, and address. | Implemented with authenticated demo profile API; changes are not persisted. |
| `/teacher/profile` | Teacher-only editor for the public storefront profile. Shows profile sections first and provides a separate edit action for each section; private contact/address data stays in `/settings`. | Implemented with authenticated teacher-profile demo API; edits are validated and echoed, not persisted. |
| `/exams/[examId]/attempt` | Legacy attempt entry for an authenticated student with access to that exam; renders the shared MCQ attempt component by exam ID. | Implemented shared component; inspect its data and demo behavior before expanding. Student-only access is intended; not currently enforced here. |
| `/exams/[examId]/results` | Released public leaderboard/summary for the exam; private result details belong in the student route. | Placeholder. |

### Student workspace

| Route | Purpose and behavior | Current UI state |
| --- | --- | --- |
| `/student/dashboard` | Student home for next exam, enrollment, and progress actions. | Placeholder. |
| `/student/courses` | List only this student's joined batches and link into their exams/materials. | Implemented with local enrollment data; student-only access is intended. |
| `/student/courses/[courseId]` | This student's course-level view, leading only to batches they can access. | Implemented with local data; ownership/access checks are intended. |
| `/student/courses/[courseId]/join?batchId=[batchId]` | Signed-in student selects/requests access to a course batch; preserve a selected batch from public enrollment. Free joining is intended to be automatic; paid access waits for teacher approval. | Implemented join panel with local UI behavior; confirm current interaction states in the component before modifying. |
| `/student/courses/[courseId]/batches/[batchId]` | Enrolled student's batch schedule, syllabus, materials, and links to upcoming attempts or released results. | Implemented with local data; membership scoping is intended. |
| `/student/exams` | Student's upcoming and past exams across batches. | Placeholder. |
| `/student/exams/[examId]/attempt` | This student's timed MCQ attempt, with the MVP timer, answer persistence, connection, and submit-confirmation policies; require enrollment/access. | Route exists; inspect shared attempt component and current demo behavior before changing. |
| `/student/exams/[examId]/results` | This student's score/rank and answer review after result release. | Placeholder. Student-only access is intended. |
| `/student/weak-zones` | This student's subject/topic weakness report based on live attempts and consented mock attempts. | Placeholder. Student-only access is intended. |

### Teacher workspace

| Route | Purpose and behavior | Current UI state |
| --- | --- | --- |
| `/teacher/dashboard` | Lean overview with total courses, batches, students, and pending batch join requests; links to course management and the student roster, and provides paginated inline request approvals. | Implemented with local course/batch and demo request data; approval state is page-local and tenant scoping is intended. |
| `/teacher/batches` | Cross-course batch directory with search, course/status filters, student totals, and next exam date; opens the existing batch management page. | Implemented with local data; tenant scoping is intended. |
| `/teacher/courses` | List the teacher's courses; opening one leads to its batch list, then each batch's exam list. Add, edit, and archive actions are available from the list. | Implemented with tenant-scoped course API data; batch/exam details remain local demo data. |
| `/teacher/students` | Teacher's approved student roster with total student and course counts, course and batch filters, and a paginated list including each student's course and batch. | Implemented with local demo student data; tenant scoping is intended. |
| `/teacher/courses/new` | Create a course with its course-level price and public description; course creation also creates its default batch. | Implemented with authenticated tenant-scoped API. |
| `/teacher/courses/[courseId]/edit` | Edit a course owned by the signed-in teacher. | Implemented with authenticated tenant-scoped API. |
| `/teacher/courses/[courseId]` | Own-course summary and batches; start a batch/route or manage an existing one. | Implemented with authenticated tenant-scoped course and batch API data; batch detail/actions remain local/demo. |
| `/teacher/courses/[courseId]/batches/new` | Create a batch schedule and syllabus under a course. | Implemented form; data is local/demo. |
| `/teacher/courses/[courseId]/batches/[batchId]` | Minimal batch info card first, then an editable exam list with the add-exam action in its header. Batch edit form includes description, schedule, syllabus, and learning materials. | Implemented with local demo data; changes are page-local and tenant scoping is intended. |
| `/teacher/courses/[courseId]/batches/[batchId]/edit` | Update batch schedule and syllabus. | Implemented form; data is local/demo. |
| `/teacher/courses/[courseId]/batches/[batchId]/exams` | List, add, and edit exams for this batch. | Implemented with local demo data; changes are page-local. |
| `/teacher/courses/[courseId]/batches/[batchId]/exams/new` | Create an MCQ exam in a batch, including schedule and exam rules. | Route exists; placeholder. |
| `/teacher/courses/[courseId]/batches/[batchId]/exams/[examId]` | Edit public exam details and rules for an exam in the teacher's own course. | Implemented details form; data is local/demo. |
| `/teacher/courses/[courseId]/batches/[batchId]/exams/[examId]/questions` | Review, add, and edit the exam's MCQ questions and correct answers. | Implemented with seeded local demo questions; changes are page-local. |
| `/teacher/courses/[courseId]/exams` | Earlier course-level exam list route; batch-based workflow is now the primary model. | Placeholder/legacy route. Preserve compatibility unless explicitly asked to remove it. |
| `/teacher/courses/[courseId]/exams/new` | Earlier course-level exam creation route. | Placeholder/legacy route. |
| `/teacher/courses/[courseId]/exams/[examId]` | Earlier course-level exam editor. | Placeholder/legacy route. |
| `/teacher/courses/[courseId]/exams/[examId]/print` | Print/export exam questions with Bangla-capable output and teacher/platform attribution. | Placeholder. |
| `/teacher/courses/[courseId]/exam-topics/[topicId]` | Manage a scheduled route topic. | Placeholder. |
| `/teacher/questions` | Question-bank management and reuse. | Placeholder. |
| `/teacher/questions/import` | Import MCQs using the official CSV template and validate rows before use. | Placeholder. |
| `/teacher/billing` | Review student-submitted payment references and approve or reject course access requests. Payment itself remains outside the platform. | Implemented with local mock requests and page-local status changes; no real payment or membership changes occur. |
| `/teacher/branding` | Configure teacher page identity and branding. | Placeholder. |
| `/teacher/profile` | View and edit the teacher's public name, specialty, biography, teaching subjects, institution, and location. Each section has its own edit state. | Implemented with authenticated demo profile API; edits are not persisted. |
| `/teacher/reset-codes` | Generate a one-time manual password reset code for a student in the teacher's own course(s). | Implemented form; confirm component behavior before changes. |

### Admin workspace

| Route | Purpose and behavior | Current UI state |
| --- | --- | --- |
| `/admin/dashboard` | Platform-wide summary of teachers, courses, batches, and students, with links to the teacher and course directories. Admin can see cross-tenant data. | Implemented with local demo directory data; dashboard counts are read-only. |
| `/admin/tenants` | Onboard/manage teacher tenants and teacher pages. | Placeholder. |
| `/admin/invoices` | Prepare or track manual invoices based on negotiated per-student rates. | Placeholder. |
| `/admin/support` | Read-only cross-tenant support lookup for helping teachers/students. | Placeholder. |
| `/admin/reset-codes` | Admin-assisted one-time password reset code flow. | Implemented form; confirm component behavior before changes. |

### Teacher storefront

| Route | Purpose and behavior | Current UI state |
| --- | --- | --- |
| `/t/[slug]` | Branded teacher home with profile, courses, batches, and enrollment calls to action. A signed-in owner sees links to edit public profile and add a course; students and visitors see the read-only storefront. | Implemented with local teacher/course data and owner-only controls. |
| `/t/[slug]/about` | Teacher profile, credentials, specialty, and public information. | Implemented with local data. |
| `/t/[slug]/login?next=[path]` | Student signs into the account belonging to this teacher page with email or phone and password, then returns to the teacher storefront home. | Implemented; login is scoped to the page slug and establishes a page-bound student session; ignores `next` after login. |
| `/t/[slug]/signup?next=[path]` | Create a student account for this teacher page and continue into enrollment. The account is shared by all courses, batches, and exams on this page. | Implemented; student credentials are unique within the page and may be reused on another teacher page. |
| `/t/[slug]/s/[studentUsername]` | Teacher-specific student dashboard showing a compact overview across this student's courses with the teacher, each joined course's summary, and the next three exams across those courses. Username is generated at signup; the route must resolve only the signed-in student's own identity and teacher memberships once authorization is implemented. | Implemented with local mock data; student identity and membership checks are not enforced. |
| `/t/[slug]/s/[studentUsername]/course/[courseId]` | Student's course-specific progress page showing attendance, average and best score, course rank, recent exam results/ranks, subject accuracy, and the next exam. Course must belong to the teacher in the URL. | Implemented with local mock data; student identity and membership checks are not enforced. |
| `/t/[slug]/course/[courseId]` | Branded course details for a course owned by this teacher; mismatched teacher/course pairs return not found. | Implemented with local data; read-only for all storefront visitors. |
| `/t/[slug]/batch/[batchId]` | Branded batch schedule and enrollment view. | Implemented component; data is local/demo and read-only for storefront visitors. |
| `/t/[slug]/batch/[batchId]/exam` | Compatibility route that redirects to the batch page. | Redirect. |
| `/t/[slug]/batch/[batchId]/exam/[examId]` | Student attempt entry for an exam in this teacher's batch; require student login and approved batch access before starting. | Implemented shared attempt component with demo exam data; access enforcement is intended. |

## Implementation guidance

- For a new or changed flow, follow the route's role and the business decision above. Keep the course → batch → exam hierarchy intact unless the user explicitly changes it.
- Route files describe screen composition and URL behavior. Feature components own form state, validation, and feedback; feature-local data stays near its feature. Reuse existing UI components and tokens.
- A route marked placeholder is a valid route but not a delivered workflow. Do not document intended business behavior as implemented behavior.
- Follow the intended visibility model above when building navigation and page states: global directory/admin pages, tenant-scoped teacher pages, student-owned pages, and public teacher storefront pages have different audiences. A hidden link is not authorization; implement route and data access checks when backend work is approved.
- The current route set includes API-backed auth even though the UI-first project instruction says to avoid adding or expanding API behavior until the user approves backend work. For new work, obey the current agent instruction; don't use this inventory as approval to extend API calls.
- Keep this map aligned with `docs/mvp-spec.md`, the current code, and the current user-approved business decisions when adding, removing, or materially changing routes.
