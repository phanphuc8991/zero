import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { deleteCategorySchema } from "@/features/courses/contants";

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = deleteCategorySchema.safeParse(body);
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const { id } = parsed.data;

    const existingCategory = await db.category.findUnique({
      where: { id },
    });
    if (!existingCategory) return apiResponse.error("CATEGORY_NOT_FOUND", 404);

    await db.category.delete({
      where: { id },
    });

    return apiResponse.success(
      {
        message: "CATEGORY_DELETED_SUCCESS",
      },
      200,
    );
  } catch (error: any) {
    console.error("Delete category error:", error);

    if (error?.code === "P2003") {
      return apiResponse.error("CATEGORY_IS_IN_USE_BY_COURSES", 400);
    }

    return apiResponse.error("SERVER_ERROR", 500);
  }
}
