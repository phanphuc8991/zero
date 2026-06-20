import { CourseEditForm } from "@/features/courses/components/course/course-edit-form";
import { CourseFormSkeleton } from "@/features/courses/components/course/course-form-skeleton";
import {
  getCategories,
  getInstructors,
  getCourseById,
  getChaptersByCourseId,
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
  const [categories, instructors, courseResult, chaptersResult] =
    await Promise.all([
      getCategories(),
      getInstructors(),
      getCourseById(courseId),
      getChaptersByCourseId(courseId),
    ]);
  const initialChapters = chaptersResult.success
    ? chaptersResult.data.chapters
    : [];
  return (
    <CourseEditForm
      courseId={courseId}
      categories={categories}
      instructors={instructors}
      initialData={courseResult.data}
      initialChapters={initialChapters}
    />
  );
}
