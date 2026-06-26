import { ListCourse } from "@/features/user/course/components/list-course";
import ListCourseSkeleton from "@/features/user/course/components/list-course-skeleton";
import { getEnrolledCourses } from "@/features/user/course/server-action";
import { Suspense } from "react";

export default function ListCourseUser() {
  return (
    <div className="p-6">
      <Suspense fallback={<ListCourseSkeleton />}>
        <ListCourseUserWrapper />
      </Suspense>
    </div>
  );
}

export async function ListCourseUserWrapper() {
  const result = await getEnrolledCourses({ status: "all" });

  return <ListCourse initialCourses={result.data || []} />;
}
