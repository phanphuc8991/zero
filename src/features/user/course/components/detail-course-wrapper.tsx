import DetailCourseSkeleton from "@/features/user/course/components/detail-course-skeleton";
import { DetailCourse } from "@/features/user/course/components/detail-course";
import { getCourseDetail } from "@/features/user/course/server-action";
import { Suspense } from "react";

export default function CourseDetailUser({ slug }: { slug: string }) {
  return (
    <div className="p-6">
      <Suspense fallback={<DetailCourseSkeleton />}>
        <CourseDetailPageWrapper slug={slug} />
      </Suspense>
    </div>
  );
}

export async function CourseDetailPageWrapper({ slug }: { slug: string }) {
  const result = await getCourseDetail(slug);
  if (!result.data) {
    return;
  }
  console.log("result", result);
  return (
    <div className="">
      <DetailCourse course={result.data} />
    </div>
  );
}
