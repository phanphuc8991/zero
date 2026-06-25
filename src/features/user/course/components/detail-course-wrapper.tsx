import DetailCourse from "@/features/user/course/components/detail-course";
import { getCourseDetail } from "@/features/user/course/server-action";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({ slug }: any) {
  const result = await getCourseDetail(slug);

  if (!result.success || !result.data) {
    return notFound();
  }

  return (
    <div className="">
      <DetailCourse course={result.data} />
    </div>
  );
}
