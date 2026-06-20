import EditCourse from "@/features/courses/edit-course";
import { notFound } from "next/navigation";
interface EditCoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function Page({ params }: EditCoursePageProps) {
  const { courseId } = await params;
  const formatCourseId = parseInt(courseId, 10);

  if (isNaN(formatCourseId)) {
    notFound();
  }
  return (
    <>
      <EditCourse courseId={formatCourseId} />
    </>
  );
}
