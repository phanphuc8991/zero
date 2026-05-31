import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { editCategorySchema } from "@/features/courses/contants";

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = editCategorySchema.safeParse(body);
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const { id, name, slug, description } = parsed.data;
    const existingCategory = await db.category.findUnique({
      where: { id },
    });
    if (!existingCategory) return apiResponse.error("CATEGORY_NOT_FOUND", 44);
    const categoryWithSameSlug = await db.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });
    if (categoryWithSameSlug)
      return apiResponse.error("SLUG_ALREADY_EXISTS", 400);
    const updatedCategory = await db.category.update({
      where: { id },
      data: { name, slug, description },
    });

    return apiResponse.success(
      {
        message: "CATEGORY_UPDATED_SUCCESS",
        category: { id: updatedCategory.id, name: updatedCategory.name },
      },
      200,
    );
  } catch (error: any) {
    console.error("Update category error:", error);
    if (error?.code === "P2002")
      return apiResponse.error("SLUG_ALREADY_EXISTS", 400);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
