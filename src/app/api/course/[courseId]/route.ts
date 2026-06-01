import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { editCourseSchema } from "@/features/courses/contants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId: rawCourseId } = await params;
    const courseId = Number(rawCourseId);
    if (isNaN(courseId)) return apiResponse.error("INVALID_ID", 400);

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });

    if (!course) return apiResponse.error("COURSE_NOT_FOUND", 404);

    return apiResponse.success({ course }, 200);
  } catch (error: any) {
    console.error("Get course error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    console.log("params", await params);
    const { courseId: rawCourseId } = await params;

    const courseId = Number(rawCourseId);
    console.log("id", courseId);
    if (isNaN(courseId)) return apiResponse.error("INVALID_ID", 400);

    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = editCourseSchema.safeParse({ ...body, id: courseId });
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const rawData = parsed.data;

    const categoryId =
      rawData.categoryId !== undefined ? Number(rawData.categoryId) : undefined;
    const instructorId =
      rawData.instructorId !== undefined
        ? Number(rawData.instructorId)
        : undefined;

    if (Number.isNaN(categoryId))
      return apiResponse.error("INVALID_CATEGORY_ID", 400);
    if (Number.isNaN(instructorId))
      return apiResponse.error("INVALID_INSTRUCTOR_ID", 400);

    const [existingCourse, categoryExists, instructorExists] =
      await Promise.all([
        db.course.findUnique({ where: { id: courseId } }),
        categoryId !== undefined
          ? db.category.findUnique({ where: { id: categoryId } })
          : Promise.resolve(true),
        instructorId !== undefined
          ? db.instructor.findUnique({ where: { id: instructorId } })
          : Promise.resolve(true),
      ]);

    if (!existingCourse) return apiResponse.error("COURSE_NOT_FOUND", 404);
    if (!categoryExists) return apiResponse.error("CATEGORY_NOT_FOUND", 404);
    if (!instructorExists)
      return apiResponse.error("INSTRUCTOR_NOT_FOUND", 404);

    const finalCategoryId =
      categoryId !== undefined && categoryId !== existingCourse.categoryId
        ? categoryId
        : undefined;
    const finalInstructorId =
      instructorId !== undefined && instructorId !== existingCourse.instructorId
        ? instructorId
        : undefined;

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        title: rawData.title,
        slug: rawData.slug,
        description: rawData.description,
        level: rawData.level || "All Levels",
        durationHours: rawData.durationHours,
        ...(finalCategoryId !== undefined && { categoryId: finalCategoryId }),
        ...(finalInstructorId !== undefined && {
          instructorId: finalInstructorId,
        }),
        ...(rawData.status && { isPublished: rawData.status === "published" }),
      },
    });

    return apiResponse.success(
      {
        message: "COURSE_UPDATED_SUCCESS",
        course: { id: updatedCourse.id, slug: updatedCourse.slug },
      },
      200,
    );
  } catch (error: any) {
    console.error("Update course error:", error);

    if (error?.code === "P2002" && error?.meta?.target?.includes("slug")) {
      return apiResponse.error("SLUG_ALREADY_EXISTS", 400);
    }

    return apiResponse.error("SERVER_ERROR", 500);
  }
}
