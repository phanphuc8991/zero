import CourseDetailUser from "@/features/user/course/components/detail-course-wrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CourseDetailUser slug={slug} />;
}
