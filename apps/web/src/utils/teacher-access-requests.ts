import { getCourseBatches, getTeacherCourses } from "@/utils/course-batches";

export type TeacherAccessRequest = {
  id: string;
  student: string;
  username: string;
  courseId: string;
  batchId?: string;
  courseTitle: string;
  batchTitle: string;
  transactionId: string;
  amount: number;
  requestedAt: string;
};

export type TeacherStudent = {
  id: string;
  name: string;
  username: string;
  courseTitle: string;
  batchTitle: string;
};

export function getTeacherAccessRequests(teacherId: string): TeacherAccessRequest[] {
  const courses = getTeacherCourses(teacherId);
  if (!courses.length) return [];
  const requests = [
    {
      id: "req-01",
      student: "নাবিলা আক্তার",
      username: "nabila_17",
      courseId: courses[0].id,
      batchIndex: 0,
      transactionId: "TXN-84K2P9",
      amount: 499,
      requestedAt: "১০ মিনিট আগে",
    },
    {
      id: "req-02",
      student: "সাব্বির হোসেন",
      username: "sabbir_h",
      courseId: (courses[1] ?? courses[0]).id,
      batchIndex: 0,
      transactionId: "TXN-73M4N1",
      amount: 499,
      requestedAt: "৩৫ মিনিট আগে",
    },
    {
      id: "req-03",
      student: "ফারজানা ইয়াসমিন",
      username: "farzana_y",
      courseId: (courses[2] ?? courses[0]).id,
      batchIndex: 0,
      transactionId: "TXN-62L8Q5",
      amount: 399,
      requestedAt: "১ ঘণ্টা আগে",
    },
    {
      id: "req-04",
      student: "রাকিবুল ইসলাম",
      username: "rakib_job",
      courseId: courses[0].id,
      batchIndex: 0,
      transactionId: "TXN-51J3D7",
      amount: 499,
      requestedAt: "আজ, সকাল ৯:২০",
    },
    {
      id: "req-05",
      student: "তানজিলা রহমান",
      username: "tanjila_r",
      courseId: (courses[1] ?? courses[0]).id,
      batchIndex: 0,
      transactionId: "TXN-40H6A2",
      amount: 499,
      requestedAt: "গতকাল",
    },
    {
      id: "req-06",
      student: "ইমরান কবির",
      username: "imran_k",
      courseId: courses[0].id,
      batchIndex: 0,
      transactionId: "TXN-39F1B8",
      amount: 499,
      requestedAt: "গতকাল",
    },
    {
      id: "req-07",
      student: "মেহজাবিন নূর",
      username: "mehja_n",
      courseId: (courses[2] ?? courses[0]).id,
      batchIndex: 0,
      transactionId: "TXN-28C5W4",
      amount: 399,
      requestedAt: "২ দিন আগে",
    },
  ];

  return requests.map((request) => {
    const course = courses.find(({ id }) => id === request.courseId) ?? courses[0];
    const batch = getCourseBatches(course.id)[request.batchIndex];
    return {
      ...request,
      batchId: batch?.id,
      courseTitle: course.title,
      batchTitle: batch?.title ?? "ব্যাচ নির্বাচন হয়নি",
    };
  });
}

export function getTeacherStudents(teacherId: string): TeacherStudent[] {
  const courses = getTeacherCourses(teacherId);
  const names = [
    ["আফসানা রহমান", "afsana_r"],
    ["মো. আরিফ হোসেন", "arif_h"],
    ["সাদিয়া ইসলাম", "sadia_i"],
    ["তানভীর আহমেদ", "tanvir_a"],
    ["নুসরাত জাহান", "nusrat_j"],
    ["রিফাত করিম", "rifat_k"],
    ["মেহজাবিন আক্তার", "mehjabin_a"],
    ["সাইফুল ইসলাম", "saiful_i"],
    ["ইশরাত নওরীন", "ishrat_n"],
    ["জুবায়ের হাসান", "jubayer_h"],
    ["ফারহানা ইয়াসমিন", "farhana_y"],
    ["ইমরান কবির", "imran_k"],
  ];
  return courses.flatMap((course, courseIndex) =>
    getCourseBatches(course.id).flatMap((batch, batchIndex) =>
      names.slice(0, Math.min(batch.studentCount, names.length)).map(([name, username], studentIndex) => ({
        id: `${course.id}-${batch.id}-${studentIndex}`,
        name,
        username: `${username}${courseIndex + batchIndex || ""}`,
        courseTitle: course.title,
        batchTitle: batch.title,
      })),
    ),
  );
}
