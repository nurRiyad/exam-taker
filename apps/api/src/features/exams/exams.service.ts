import type { Database } from "@exam-taker/db";
import type { CreateExamInput, UpdateExamInput } from "@exam-taker/validation/exams";
import { ConflictError, NotFoundError } from "../../utils/errors";
import { formatSqliteTimestamp } from "../../utils/sqlite-time";
import * as examsRepository from "./exams.repository";

async function requireOwnedExam(db: Database, tenantId: string, courseId: string, batchId: string, examId: string) {
  const batch = await examsRepository.findOwnedBatch(db, tenantId, courseId, batchId);
  if (!batch) throw new NotFoundError("Batch not found");
  const exam = await examsRepository.findById(db, batchId, examId);
  if (!exam) throw new NotFoundError("Exam not found");
  return { batch, exam };
}

function examValues(input: CreateExamInput | UpdateExamInput) {
  const { startsAt, ...values } = input;
  return {
    ...values,
    ...(startsAt !== undefined ? { startsAt: formatSqliteTimestamp(new Date(startsAt)) } : {}),
    ...(startsAt !== undefined && input.durationMinutes !== undefined
      ? { endsAt: formatSqliteTimestamp(new Date(new Date(startsAt).getTime() + input.durationMinutes * 60_000)) }
      : {}),
  };
}

export async function listExams(db: Database, tenantId: string, courseId: string, batchId: string) {
  const batch = await examsRepository.findOwnedBatch(db, tenantId, courseId, batchId);
  if (!batch) throw new NotFoundError("Batch not found");
  return { exams: await examsRepository.findByBatch(db, batchId) };
}

export async function getExam(db: Database, tenantId: string, courseId: string, batchId: string, examId: string) {
  const { exam } = await requireOwnedExam(db, tenantId, courseId, batchId, examId);
  return { exam };
}

export async function createExam(
  db: Database,
  tenantId: string,
  courseId: string,
  batchId: string,
  input: CreateExamInput,
) {
  const batch = await examsRepository.findOwnedBatch(db, tenantId, courseId, batchId);
  if (!batch) throw new NotFoundError("Batch not found");
  const id = crypto.randomUUID().replaceAll("-", "");
  const exam = await examsRepository.insert(db, id, {
    id,
    batchId,
    tenantId,
    courseId,
    ...examValues(input),
  } as typeof import("@exam-taker/db/schema").exams.$inferInsert);
  if (!exam) throw new NotFoundError("Exam could not be created");
  return { exam };
}

export async function updateExam(
  db: Database,
  tenantId: string,
  courseId: string,
  batchId: string,
  examId: string,
  input: UpdateExamInput,
) {
  await requireOwnedExam(db, tenantId, courseId, batchId, examId);
  const exam = await examsRepository.update(db, batchId, examId, examValues(input));
  if (!exam) throw new NotFoundError("Exam not found");
  return { exam };
}

export async function deleteExam(db: Database, tenantId: string, courseId: string, batchId: string, examId: string) {
  await requireOwnedExam(db, tenantId, courseId, batchId, examId);
  if (await examsRepository.hasAttempts(db, examId)) {
    throw new ConflictError("An exam with student attempts cannot be deleted", { examId: "Exam has student attempts" });
  }
  await examsRepository.remove(db, batchId, examId);
  return { deleted: true as const };
}
