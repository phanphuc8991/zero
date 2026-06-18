import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const courses = await db.course.findMany({
      orderBy: { id: "desc" },
      include: {
        instructor: {
          select: { name: true },
        },
      },
    });

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      duration: course.duration,
      level: course.level,
      isPublished: course.isPublished,
      instructorName: course.instructor?.name ?? "—",
    }));
    return apiResponse.success({ courses: formattedCourses }, 200);
  } catch (error: any) {
    console.error("Get courses error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
