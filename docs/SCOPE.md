# Product Scope

Exam Taker is a mobile-first exam platform for students, teachers, and platform administrators. Existing routes and behavior are retained during the rebuild, while the web experience is redesigned with realistic mock data before backend integration is expanded.

## UI-first priorities

1. Establish a consistent visual system and responsive application shell.
2. Polish the teacher-branded public storefront, direct enrollment, and authentication flows; keep global teacher/course directories admin-only.
3. Build student exam and results experiences with mock data.
4. Build teacher course, question, and exam management experiences with mock data.
5. Build platform administration views with mock data.
6. After the user explicitly declares the frontend ready for backend work, connect settled UI flows to the API and shared packages.

This list describes sequencing, not new product requirements. Preserve existing routes and product behavior unless the project owner changes scope.

Page visibility follows [`UI-ROUTES.md`](UI-ROUTES.md): admins have platform-wide views, teachers are scoped to their own courses and enrolled students, students see their own memberships and results, and public acquisition uses teacher storefronts.
