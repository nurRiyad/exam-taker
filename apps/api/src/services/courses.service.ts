// Pure business logic — no Hono imports (see services/auth.service.ts).
import type { Database } from "../db/client";
import { computeEffectivePriceBdt } from "../utils/course-price";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";
import { formatSqliteTimestamp } from "../utils/sqlite-time";
import type { PublicUser } from "../utils/user";
import * as courseEnrollmentsRepository from "../repositories/course-enrollments.repository";
import * as coursesRepository from "../repositories/courses.repository";
import * as examTopicsRepository from "../repositories/exam-topics.repository";
import * as paymentAccessRequestsRepository from "../repositories/payment-access-requests.repository";
import * as teacherMembershipsRepository from "../repositories/teacher-memberships.repository";
import type { CreateCourseInput, PaymentRequestInput, UpdateCourseInput } from "../validation/courses";

type PaymentRequestStatus = "pending" | "approved" | "rejected";

async function requireOwnCourse(db: Database, tenantId: string, courseId: string) {
  const course = await coursesRepository.findOwnedByTenant(db, tenantId, courseId);
  if (!course) throw new NotFoundError("Course not found");
  return course;
}

async function requireOwnEnrollment(db: Database, tenantId: string, enrollmentId: string) {
  const enrollment = await courseEnrollmentsRepository.findById(db, enrollmentId);
  if (!enrollment) throw new NotFoundError("Enrollment not found");
  await requireOwnCourse(db, tenantId, enrollment.courseId);
  return enrollment;
}

export async function createCourse(db: Database, tenantId: string, input: CreateCourseInput) {
  return coursesRepository.insert(db, {
    tenantId,
    title: input.title,
    shortDescription: input.shortDescription,
    fullSyllabus: input.fullSyllabus,
    basePriceBdt: input.basePriceBdt,
    isFree: input.isFree,
    discountPercent: input.discountPercent,
    discountStartAt: input.discountStartAt ? formatSqliteTimestamp(input.discountStartAt) : undefined,
    discountEndAt: input.discountEndAt ? formatSqliteTimestamp(input.discountEndAt) : undefined,
  });
}

export async function updateCourse(db: Database, tenantId: string, courseId: string, input: UpdateCourseInput) {
  const course = await requireOwnCourse(db, tenantId, courseId);

  if (input.basePriceBdt !== undefined && input.basePriceBdt !== course.basePriceBdt) {
    if (await coursesRepository.hasEnrollments(db, courseId)) {
      throw new BadRequestError("Price cannot be changed once students have enrolled");
    }
  }

  return coursesRepository.update(db, courseId, {
    ...input,
    discountStartAt: input.discountStartAt ? formatSqliteTimestamp(input.discountStartAt) : undefined,
    discountEndAt: input.discountEndAt ? formatSqliteTimestamp(input.discountEndAt) : undefined,
  });
}

export async function publishCourse(db: Database, tenantId: string, courseId: string) {
  const course = await requireOwnCourse(db, tenantId, courseId);

  const missing: string[] = [];
  if (!course.title) missing.push("title");
  if (!course.shortDescription) missing.push("short description");
  if (!course.isFree && !(course.basePriceBdt > 0)) missing.push("a price (or mark the course free)");

  // Only topics marked `published` are "intended to be visible" (ADR-0058) —
  // a topic left at its default `draft` status doesn't count toward the
  // publish gate and won't show up for non-owning viewers (getCourseById).
  const topics = await examTopicsRepository.findByCourse(db, courseId);
  const visibleTopics = topics.filter((topic) => topic.status === "published");
  if (visibleTopics.length === 0) missing.push("at least one published exam topic");
  for (const topic of visibleTopics) {
    if (!topic.shortDescription || !topic.scheduledAt) {
      missing.push(`exam topic "${topic.title}" needs a short description and a scheduled date/time`);
    }
  }

  if (missing.length > 0) {
    throw new BadRequestError(`Cannot publish course, missing: ${missing.join("; ")}`);
  }

  return coursesRepository.update(db, courseId, { status: "published" });
}

async function isVisibleToCaller(db: Database, user: PublicUser, tenantId: string): Promise<boolean> {
  if (user.role === "admin") return true;
  if (user.role !== "teacher") return false;
  const membership = await teacherMembershipsRepository.findByUserId(db, user.id);
  return membership?.tenantId === tenantId;
}

export async function getCourseById(db: Database, user: PublicUser, courseId: string) {
  const course = await coursesRepository.findById(db, courseId);
  if (!course) throw new NotFoundError("Course not found");

  const isOwner = await isVisibleToCaller(db, user, course.tenantId);

  // Draft/archived courses aren't public yet — only the owning tenant's
  // teacher or an admin can preview them (public route visibility is Step 11).
  if (course.status !== "published" && !isOwner) {
    throw new NotFoundError("Course not found");
  }

  const topics = await examTopicsRepository.findByCourse(db, courseId);
  // Draft topics are still being prepared — only the owning tenant's teacher
  // or an admin can see them ahead of publish (ADR-0058).
  const examTopics = isOwner ? topics : topics.filter((topic) => topic.status === "published");
  return { course, examTopics };
}

export async function listTeacherCourses(db: Database, tenantId: string) {
  return coursesRepository.findByTenant(db, tenantId);
}

function computeJoinAccess(course: { isFree: boolean; basePriceBdt: number; discountPercent: number | null; discountStartAt: string | null; discountEndAt: string | null }) {
  const priceSnapshotBdt = course.isFree ? 0 : computeEffectivePriceBdt(course, new Date());
  const accessStatus = course.isFree ? "approved" : "joined_pending_payment";
  return { priceSnapshotBdt, accessStatus } as const;
}

export async function joinCourse(db: Database, studentUserId: string, courseId: string) {
  const course = await coursesRepository.findById(db, courseId);
  if (!course || course.status !== "published") throw new NotFoundError("Course not found");

  const existing = await courseEnrollmentsRepository.findByCourseAndStudent(db, courseId, studentUserId);
  if (existing) {
    if (existing.accessStatus === "blocked") {
      throw new ForbiddenError("Your access to this course has been blocked");
    }
    if (existing.accessStatus !== "removed") {
      throw new ConflictError("Already joined this course", { course: "Already joined this course" });
    }
    // Removal only blocks future access, not a permanent ban (ADR-0011) — a
    // removed student can rejoin, going through the same access flow again.
    return courseEnrollmentsRepository.update(db, existing.id, { ...computeJoinAccess(course), blockedAt: null });
  }

  try {
    return await courseEnrollmentsRepository.insert(db, { courseId, studentUserId, ...computeJoinAccess(course) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (!message.includes("UNIQUE constraint failed")) throw err;
    throw new ConflictError("Already joined this course", { course: "Already joined this course" });
  }
}

export async function createPaymentRequest(
  db: Database,
  studentUserId: string,
  courseId: string,
  input: PaymentRequestInput,
) {
  const enrollment = await courseEnrollmentsRepository.findByCourseAndStudent(db, courseId, studentUserId);
  if (!enrollment) throw new NotFoundError("Join the course before requesting payment approval");
  if (enrollment.accessStatus !== "joined_pending_payment") {
    throw new BadRequestError("This course does not need a payment request right now");
  }

  return paymentAccessRequestsRepository.insert(db, {
    courseId,
    studentUserId,
    transactionId: input.transactionId,
    status: "pending",
  });
}

export async function listPaymentRequests(
  db: Database,
  tenantId: string,
  courseId: string,
  status?: PaymentRequestStatus,
) {
  await requireOwnCourse(db, tenantId, courseId);
  return paymentAccessRequestsRepository.findByCourse(db, courseId, status);
}

export async function approvePaymentRequest(db: Database, tenantId: string, requestId: string, reviewerId: string) {
  const request = await paymentAccessRequestsRepository.findById(db, requestId);
  if (!request) throw new NotFoundError("Payment request not found");
  await requireOwnCourse(db, tenantId, request.courseId);
  if (request.status !== "pending") throw new BadRequestError("Payment request already reviewed");

  const enrollment = await courseEnrollmentsRepository.findByCourseAndStudent(
    db,
    request.courseId,
    request.studentUserId,
  );
  if (!enrollment) throw new NotFoundError("Enrollment not found for this payment request");
  // A teacher may have blocked/removed the student after they submitted this
  // request — approving a stale request must not silently reinstate access.
  if (enrollment.accessStatus !== "joined_pending_payment") {
    throw new BadRequestError("This enrollment is no longer awaiting payment approval");
  }

  const now = formatSqliteTimestamp(new Date());
  const [requestRows, enrollmentRows] = await db.batch([
    paymentAccessRequestsRepository.updateQuery(db, requestId, {
      status: "approved",
      reviewedByUserId: reviewerId,
      reviewedAt: now,
    }),
    courseEnrollmentsRepository.updateQuery(db, enrollment.id, { accessStatus: "approved" }),
  ]);

  return { request: requestRows[0], enrollment: enrollmentRows[0] };
}

export async function rejectPaymentRequest(db: Database, tenantId: string, requestId: string, reviewerId: string) {
  const request = await paymentAccessRequestsRepository.findById(db, requestId);
  if (!request) throw new NotFoundError("Payment request not found");
  await requireOwnCourse(db, tenantId, request.courseId);
  if (request.status !== "pending") throw new BadRequestError("Payment request already reviewed");

  const now = formatSqliteTimestamp(new Date());
  return paymentAccessRequestsRepository.update(db, requestId, {
    status: "rejected",
    reviewedByUserId: reviewerId,
    reviewedAt: now,
  });
}

export async function blockEnrollment(db: Database, tenantId: string, enrollmentId: string) {
  const enrollment = await requireOwnEnrollment(db, tenantId, enrollmentId);
  return courseEnrollmentsRepository.update(db, enrollment.id, {
    accessStatus: "blocked",
    blockedAt: formatSqliteTimestamp(new Date()),
  });
}

export async function removeEnrollment(db: Database, tenantId: string, enrollmentId: string) {
  const enrollment = await requireOwnEnrollment(db, tenantId, enrollmentId);
  // No `removedAt` column — access_status alone captures the transition.
  // Past results stay visible; this blocks only future access (ADR-0011).
  return courseEnrollmentsRepository.update(db, enrollment.id, { accessStatus: "removed" });
}
