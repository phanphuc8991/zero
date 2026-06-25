import { ListCourse } from "@/features/user/course/components/list-course";
import { getEnrolledCourses } from "@/features/user/course/server-action";

export default async function MyCoursesPage() {
  const result = await getEnrolledCourses({ status: "all" });
  if (!result.success) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        {result.error || "Failed to load courses."}
      </div>
    );
  }
  return <ListCourse initialCourses={result.data || []} />;
}
