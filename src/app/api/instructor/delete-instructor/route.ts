import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { deleteInstructorSchema } from "@/features/courses/contants";

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = deleteInstructorSchema.safeParse(body);
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const { id } = parsed.data;

    const existingInstructor = await db.instructor.findUnique({
      where: { id },
    });
    if (!existingInstructor)
      return apiResponse.error("INSTRUCTOR_NOT_FOUND", 404);

    await db.instructor.delete({
      where: { id },
    });

    return apiResponse.success(
      {
        message: "INSTRUCTOR_DELETED_SUCCESS",
      },
      200,
    );
  } catch (error: any) {
    console.error("Delete instructor error:", error);

    if (error?.code === "P2003") {
      return apiResponse.error("INSTRUCTOR_IS_IN_USE_BY_COURSES", 400);
    }

    return apiResponse.error("SERVER_ERROR", 500);
  }
}
