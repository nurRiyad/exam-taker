// Pure business logic — no Hono imports (see services/auth.service.ts).
import type { Database } from "../db/client";
import { NotFoundError } from "../utils/errors";
import { formatSqliteTimestamp } from "../utils/sqlite-time";
import * as coursesRepository from "../repositories/courses.repository";
import * as examTopicsRepository from "../repositories/exam-topics.repository";
import type { CreateExamTopicInput, UpdateExamTopicInput } from "../validation/exam-topics";

async function requireOwnCourse(db: Database, tenantId: string, courseId: string) {
  const course = await coursesRepository.findOwnedByTenant(db, tenantId, courseId);
  if (!course) throw new NotFoundError("Course not found");
  return course;
}

async function requireOwnExamTopic(db: Database, tenantId: string, examTopicId: string) {
  const topic = await examTopicsRepository.findById(db, examTopicId);
  if (!topic) throw new NotFoundError("Exam topic not found");
  await requireOwnCourse(db, tenantId, topic.courseId);
  return topic;
}

export async function createExamTopic(db: Database, tenantId: string, input: CreateExamTopicInput) {
  await requireOwnCourse(db, tenantId, input.courseId);
  return examTopicsRepository.insert(db, {
    courseId: input.courseId,
    title: input.title,
    shortDescription: input.shortDescription,
    scheduledAt: input.scheduledAt ? formatSqliteTimestamp(input.scheduledAt) : undefined,
    sortOrder: input.sortOrder,
  });
}

export async function updateExamTopic(
  db: Database,
  tenantId: string,
  examTopicId: string,
  input: UpdateExamTopicInput,
) {
  await requireOwnExamTopic(db, tenantId, examTopicId);
  return examTopicsRepository.update(db, examTopicId, {
    ...input,
    scheduledAt: input.scheduledAt ? formatSqliteTimestamp(input.scheduledAt) : undefined,
  });
}
