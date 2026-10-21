import { eq } from "drizzle-orm";
import type { Database } from "@exam-taker/db";
import { batches, courses } from "@exam-taker/db/schema";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import { formatSqliteTimestamp } from "../../utils/sqlite-time";
import type { CreateCourseInput, UpdateCourseInput } from "@exam-taker/validation/courses";
import type { courses as coursesTable } from "@exam-taker/db/schema";
import * as coursesRepository from "./courses.repository";

async function requireOwnCourse(db: Database, tenantId: string, courseId: string) {
  const course = await coursesRepository.findOwnedByTenant(db, tenantId, courseId);
  if (!course || course.status === "archived") throw new NotFoundError("Course not found");
  return course;
}

type CourseValues = Omit<typeof coursesTable.$inferInsert, "id" | "tenantId">;

function courseValues(input: CreateCourseInput): CourseValues;
function courseValues(input: UpdateCourseInput): Partial<CourseValues>;
function courseValues(input: CreateCourseInput | UpdateCourseInput): Partial<CourseValues> {
  const { discountStartAt, discountEndAt, ...values } = input;
  const convertedValues: Partial<CourseValues> = { ...values };
  if (discountStartAt !== undefined) {
    convertedValues.discountStartAt = formatSqliteTimestamp(discountStartAt);
  }
  if (discountEndAt !== undefined) {
    convertedValues.discountEndAt = formatSqliteTimestamp(discountEndAt);
  }
  return convertedValues;
}

function assertPublishReady(course: {
  title: string;
  shortDescription: string | null;
  isFree: boolean;
  basePriceBdt: number;
}) {
  const missing: string[] = [];
  if (!course.title.trim()) missing.push("title");
  if (!course.shortDescription?.trim()) missing.push("short description");
  if (!course.isFree && !(course.basePriceBdt > 0)) missing.push("a price (or mark the course free)");
  if (missing.length) throw new BadRequestError(`Cannot publish course, missing: ${missing.join("; ")}`);
}

export async function createCourse(db: Database, tenantId: string, input: CreateCourseInput) {
  if (input.status === "published") assertPublishReady(input);
  const courseId = crypto.randomUUID().replaceAll("-", "");
  const now = formatSqliteTimestamp(new Date());
  const defaultBatchId = crypto.randomUUID().replaceAll("-", "");

  await db.batch([
    db.insert(courses).values({ id: courseId, tenantId, ...courseValues(input) }),
    db.insert(batches).values({
      id: defaultBatchId,
      courseId,
      title: "সাধারণ ব্যাচ",
      description: "এই কোর্সের শিক্ষার্থীদের জন্য ডিফল্ট ব্যাচ।",
      isDefault: true,
      status: "upcoming",
      createdAt: now,
    }),
  ]);

  const course = await coursesRepository.findOwnedByTenant(db, tenantId, courseId);
  if (!course) throw new NotFoundError("Course could not be created");
  return course;
}

export async function updateCourse(db: Database, tenantId: string, courseId: string, input: UpdateCourseInput) {
  const course = await requireOwnCourse(db, tenantId, courseId);
  if (input.status === "published") {
    assertPublishReady({
      title: input.title ?? course.title,
      shortDescription: input.shortDescription ?? course.shortDescription,
      isFree: input.isFree ?? course.isFree,
      basePriceBdt: input.basePriceBdt ?? course.basePriceBdt,
    });
  }
  if (input.basePriceBdt !== undefined && input.basePriceBdt !== course.basePriceBdt) {
    if (await coursesRepository.hasBatchMemberships(db, courseId)) {
      throw new BadRequestError("Price cannot be changed once students have joined a batch");
    }
  }
  return coursesRepository.update(db, courseId, courseValues(input));
}

export async function getTeacherCourse(db: Database, tenantId: string, courseId: string) {
  const course = await requireOwnCourse(db, tenantId, courseId);
  const courseBatches = await db.select().from(batches).where(eq(batches.courseId, courseId));
  return { course, batches: courseBatches };
}

export function listTeacherCourses(db: Database, tenantId: string) {
  return coursesRepository.findByTenant(db, tenantId);
}

export async function archiveCourse(db: Database, tenantId: string, courseId: string) {
  await requireOwnCourse(db, tenantId, courseId);
  await coursesRepository.update(db, courseId, { status: "archived" });
  return { deleted: true as const };
}

export async function getCourseById(db: Database, courseId: string) {
  const course = await coursesRepository.findById(db, courseId);
  if (!course || course.status !== "published") throw new NotFoundError("Course not found");
  const courseBatches = await db.select().from(batches).where(eq(batches.courseId, courseId));
  return { course, batches: courseBatches };
}

export async function publishCourse(db: Database, tenantId: string, courseId: string) {
  const course = await requireOwnCourse(db, tenantId, courseId);
  assertPublishReady(course);
  return coursesRepository.update(db, courseId, { status: "published" });
}
