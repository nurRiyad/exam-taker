import { eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { examTopics } from "../db/schema";

type ExamTopicRow = typeof examTopics.$inferSelect;
type NewExamTopic = typeof examTopics.$inferInsert;

export async function findById(db: Database, id: string): Promise<ExamTopicRow | undefined> {
  const [topic] = await db.select().from(examTopics).where(eq(examTopics.id, id)).limit(1);
  return topic;
}

export async function findByCourse(db: Database, courseId: string): Promise<ExamTopicRow[]> {
  return db.select().from(examTopics).where(eq(examTopics.courseId, courseId)).orderBy(examTopics.sortOrder);
}

export async function insert(db: Database, data: NewExamTopic): Promise<ExamTopicRow> {
  const [topic] = await db.insert(examTopics).values(data).returning();
  return topic;
}

export async function update(db: Database, id: string, data: Partial<NewExamTopic>): Promise<ExamTopicRow> {
  const [topic] = await db.update(examTopics).set(data).where(eq(examTopics.id, id)).returning();
  return topic;
}
