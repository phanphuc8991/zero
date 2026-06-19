import { CourseCreateForm } from "@/features/courses/components/course-create-form";
import { CourseFormSkeleton } from "@/features/courses/components/course-form-skeleton";
import {
  getCategories,
  getInstructors,
} from "@/features/courses/server-action";
import { Suspense } from "react";

export function CreateCoursePage() {
  return (
    <div className="p-6">
      <Suspense fallback={<CourseFormSkeleton />}>
        <CreateCourseFormWrapper />
      </Suspense>
    </div>
  );
}

async function CreateCourseFormWrapper() {
  const [categories, instructors] = await Promise.all([
    getCategories(),
    getInstructors(),
  ]);
  return <CourseCreateForm categories={categories} instructors={instructors} />;
}
