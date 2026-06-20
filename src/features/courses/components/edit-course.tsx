import { CourseEditForm } from "@/features/courses/components/course-edit-form";
import { CourseFormSkeleton } from "@/features/courses/components/course-form-skeleton";
import {
  getCategories,
  getInstructors,
  getCourseById,
} from "@/features/courses/server-action";
import { Suspense } from "react";

export default function EditCourse({ courseId }: { courseId: number }) {
  return (
    <div className="p-6">
      <Suspense fallback={<CourseFormSkeleton />}>
        <EditCourseFormWrapper courseId={courseId} />
      </Suspense>
    </div>
  );
}

async function EditCourseFormWrapper({ courseId }: { courseId: number }) {
  const [categories, instructors, courseResult] = await Promise.all([
    getCategories(),
    getInstructors(),
    getCourseById(courseId),
  ]);

  return (
    <CourseEditForm
      courseId={courseId}
      categories={categories}
      instructors={instructors}
      initialData={courseResult.data}
    />
  );
}
