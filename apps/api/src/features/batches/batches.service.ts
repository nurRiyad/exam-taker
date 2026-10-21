import type { Database } from "@exam-taker/db";
import type { CreateBatchInput, UpdateBatchInput } from "@exam-taker/validation/batches";
import { NotFoundError } from "../../utils/errors";
import * as batchesRepository from "./batches.repository";

async function requireOwnedBatch(db: Database, tenantId: string, courseId: string, batchId: string) {
  if (!(await batchesRepository.findOwnedCourse(db, tenantId, courseId))) throw new NotFoundError("Course not found");
  const batch = await batchesRepository.findById(db, courseId, batchId);
  if (!batch) throw new NotFoundError("Batch not found");
  return batch;
}

export async function listCourseBatches(db: Database, tenantId: string, courseId: string) {
  if (!(await batchesRepository.findOwnedCourse(db, tenantId, courseId))) throw new NotFoundError("Course not found");
  return { batches: await batchesRepository.findByCourse(db, courseId) };
}

export async function getBatch(db: Database, tenantId: string, courseId: string, batchId: string) {
  return { batch: await requireOwnedBatch(db, tenantId, courseId, batchId) };
}

export async function createBatch(db: Database, tenantId: string, courseId: string, input: CreateBatchInput) {
  if (!(await batchesRepository.findOwnedCourse(db, tenantId, courseId))) throw new NotFoundError("Course not found");
  const id = crypto.randomUUID().replaceAll("-", "");
  const batch = await batchesRepository.insert(db, id, {
    id,
    courseId,
    ...input,
    isDefault: false,
  });
  if (!batch) throw new NotFoundError("Batch could not be created");
  return { batch };
}

export async function updateBatch(
  db: Database,
  tenantId: string,
  courseId: string,
  batchId: string,
  input: UpdateBatchInput,
) {
  await requireOwnedBatch(db, tenantId, courseId, batchId);
  const batch = await batchesRepository.update(db, courseId, batchId, input);
  if (!batch) throw new NotFoundError("Batch not found");
  return { batch };
}

export async function deleteBatch(db: Database, tenantId: string, courseId: string, batchId: string) {
  await requireOwnedBatch(db, tenantId, courseId, batchId);
  await batchesRepository.remove(db, courseId, batchId);
  return { deleted: true as const };
}
