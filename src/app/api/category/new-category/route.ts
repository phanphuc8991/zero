import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { categoryFormSchema } from "@/features/courses/contants";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = categoryFormSchema.safeParse(body);
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const { name, slug, description } = parsed.data;

    const categoryWithSameSlug = await db.category.findUnique({
      where: { slug },
    });
    if (categoryWithSameSlug)
      return apiResponse.error("SLUG_ALREADY_EXISTS", 400);

    const category = await db.category.create({
      data: { name, slug, description },
    });

    return apiResponse.success(
      {
        message: "CATEGORY_CREATED_SUCCESS",
        category: { id: category.id, name: category.name },
      },
      201,
    );
  } catch (error: any) {
    console.error("Create category error:", error);
    if (error?.code === "P2002")
      return apiResponse.error("SLUG_ALREADY_EXISTS", 400);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
