import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { courseFormSchema } from "@/features/courses/contants";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = courseFormSchema.safeParse(body);
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const rawData = parsed.data;

    const categoryId = Number(rawData.categoryId);
    const instructorId = Number(rawData.instructorId);
    const isPublished = rawData.status === "published";

    const [categoryExists, instructorExists, courseWithSameSlug] =
      await Promise.all([
        db.category.findUnique({ where: { id: categoryId } }),
        db.instructor.findUnique({ where: { id: instructorId } }),
        db.course.findUnique({ where: { slug: rawData.slug } }),
      ]);

    if (!categoryExists) return apiResponse.error("CATEGORY_NOT_FOUND", 404);
    if (!instructorExists)
      return apiResponse.error("INSTRUCTOR_NOT_FOUND", 404);
    if (courseWithSameSlug)
      return apiResponse.error("SLUG_ALREADY_EXISTS", 400);

    const course = await db.course.create({
      data: {
        title: rawData.title,
        slug: rawData.slug,
        description: rawData.description,
        level: rawData.level || "All Levels",
        durationHours: rawData.durationHours,
        categoryId,
        instructorId,
        isPublished,
        thumbnailUrl: rawData.thumbnailUrl || null,
      },
    });

    return apiResponse.success(
      {
        message: "COURSE_CREATED_SUCCESS",
        course: { id: course.id, slug: course.slug },
      },
      201,
    );
  } catch (error: any) {
    console.error("Create course error:", error);
    if (error?.code === "P2002")
      return apiResponse.error("SLUG_ALREADY_EXISTS", 400);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
