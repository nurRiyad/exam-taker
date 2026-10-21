import { notFound } from "next/navigation";
import { TeacherAccessRequests } from "@/components/teacher-access-requests";
import { getCourseBatches, getTeacherCourses } from "@/lib/course-batches";

export default function TeacherBillingPage() {
  const courses = getTeacherCourses("mahbub-hasan");
  if (!courses.length) notFound();
  const requests = [
    {
      id: "req-01",
      student: "নাবিলা আক্তার",
      username: "nabila_17",
      courseId: courses[0].id,
      batchId: getCourseBatches(courses[0].id)[0]?.id,
      transactionId: "TXN-84K2P9",
      amount: 499,
      requestedAt: "১০ মিনিট আগে",
    },
    {
      id: "req-02",
      student: "সাব্বির হোসেন",
      username: "sabbir_h",
      courseId: courses[1]?.id ?? courses[0].id,
      batchId: getCourseBatches(courses[1]?.id ?? courses[0].id)[0]?.id,
      transactionId: "TXN-73M4N1",
      amount: 499,
      requestedAt: "৩৫ মিনিট আগে",
    },
    {
      id: "req-03",
      student: "ফারজানা ইয়াসমিন",
      username: "farzana_y",
      courseId: courses[2]?.id ?? courses[0].id,
      batchId: getCourseBatches(courses[2]?.id ?? courses[0].id)[0]?.id,
      transactionId: "TXN-62L8Q5",
      amount: 399,
      requestedAt: "১ ঘণ্টা আগে",
    },
    {
      id: "req-04",
      student: "রাকিবুল ইসলাম",
      username: "rakib_job",
      courseId: courses[0].id,
      batchId: getCourseBatches(courses[0].id)[0]?.id,
      transactionId: "TXN-51J3D7",
      amount: 499,
      requestedAt: "আজ, সকাল ৯:২০",
    },
    {
      id: "req-05",
      student: "তানজিলা রহমান",
      username: "tanjila_r",
      courseId: courses[1]?.id ?? courses[0].id,
      batchId: getCourseBatches(courses[1]?.id ?? courses[0].id)[0]?.id,
      transactionId: "TXN-40H6A2",
      amount: 499,
      requestedAt: "গতকাল",
    },
    {
      id: "req-06",
      student: "ইমরান কবির",
      username: "imran_k",
      courseId: courses[0].id,
      batchId: getCourseBatches(courses[0].id)[0]?.id,
      transactionId: "TXN-39F1B8",
      amount: 499,
      requestedAt: "গতকাল",
    },
    {
      id: "req-07",
      student: "মেহজাবিন নূর",
      username: "mehja_n",
      courseId: courses[2]?.id ?? courses[0].id,
      batchId: getCourseBatches(courses[2]?.id ?? courses[0].id)[0]?.id,
      transactionId: "TXN-28C5W4",
      amount: 399,
      requestedAt: "২ দিন আগে",
    },
  ].map((request) => ({
    ...request,
    courseTitle: courses.find((course) => course.id === request.courseId)?.title ?? courses[0].title,
    batchTitle:
      getCourseBatches(request.courseId).find((batch) => batch.id === request.batchId)?.title ?? "ব্যাচ নির্বাচন হয়নি",
  }));

  return <TeacherAccessRequests initialRequests={requests} />;
}
