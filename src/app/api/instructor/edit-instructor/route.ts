import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { editInstructorSchema } from "@/features/courses/contants";

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = editInstructorSchema.safeParse(body);
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const { id, name, title, avatarUrl, bio } = parsed.data;

    const existingInstructor = await db.instructor.findUnique({
      where: { id },
    });
    if (!existingInstructor)
      return apiResponse.error("INSTRUCTOR_NOT_FOUND", 404);

    const updatedInstructor = await db.instructor.update({
      where: { id },
      data: {
        name,
        title,
        avatarUrl: avatarUrl || null,
        bio: bio || null,
      },
    });

    return apiResponse.success(
      {
        message: "INSTRUCTOR_UPDATED_SUCCESS",
        instructor: {
          id: updatedInstructor.id,
          name: updatedInstructor.name,
        },
      },
      200,
    );
  } catch (error: any) {
    console.error("Update instructor error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
