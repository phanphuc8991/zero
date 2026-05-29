import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { instructorFormSchema } from "@/features/courses/contants";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = instructorFormSchema.safeParse(body);
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const { name, title, avatarUrl, bio } = parsed.data;

    const instructor = await db.instructor.create({
      data: {
        name,
        title,
        avatarUrl: avatarUrl || null,
        bio,
      },
    });

    return apiResponse.success(
      {
        message: "INSTRUCTOR_CREATED_SUCCESS",
        instructor: { id: instructor.id, name: instructor.name },
      },
      201,
    );
  } catch (error: any) {
    console.error("Create instructor error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
