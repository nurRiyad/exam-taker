import { PlaceholderPage } from "@/components/placeholder-page";

type TeacherExamTopicPageProps = {
  params: Promise<{ courseId: string; topicId: string }>;
};

export default async function TeacherExamTopicPage({ params }: TeacherExamTopicPageProps) {
  const { courseId, topicId } = await params;

  return (
    <PlaceholderPage
      title="Manage exam topic"
      description={`Exam topic placeholder for ${topicId} in course ${courseId}.`}
    />
  );
}