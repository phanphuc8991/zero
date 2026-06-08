"use client";

import EditCourse from "@/features/courses/components/edit-course";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const courseId = Number(params.courseId);
  return (
    <>
      <EditCourse courseId={courseId} />
    </>
  );
}
