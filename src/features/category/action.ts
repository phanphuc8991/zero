"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { ActionResponse } from "@/features/courses/contants-1";
import {
  CategoryFormInput,
  categoryFormSchema,
  DeleteCategoryInput,
  deleteCategorySchema,
  EditCategoryInput,
  editCategorySchema,
} from "@/features/category/contants";

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Get categories error:", error);
    throw new Error("FETCH_CATEGORY_LIST_ERROR");
  }
}

export async function createCategory(
  data: CategoryFormInput,
): Promise<
  ActionResponse<{ message: string; category: { id: number; name: string } }>
> {
  try {
    const parsed = categoryFormSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, status: 400, error: "INVALID_CATEGORY_INPUT" };
    }

    const { name, slug, description } = parsed.data;

    const categoryWithSameSlug = await db.category.findUnique({
      where: { slug },
    });
    if (categoryWithSameSlug) {
      return {
        success: false,
        status: 400,
        error: "SLUG_CATEGORY_ALREADY_EXISTS",
      };
    }

    const category = await db.category.create({
      data: { name, slug, description },
    });

    revalidatePath("/admin/categories");

    return {
      success: true,
      status: 201,
      data: {
        message: "CATEGORY_CREATED_SUCCESS",
        category: { id: category.id, name: category.name },
      },
    };
  } catch (error: any) {
    console.error("Create category error:", error);
    if (error?.code === "P2002") {
      return {
        success: false,
        status: 400,
        error: "SLUG_CATEGORY_ALREADY_EXISTS",
      };
    }
    return { success: false, status: 500, error: "SERVER_ERROR" };
  }
}

export async function updateCategory(
  data: EditCategoryInput,
): Promise<
  ActionResponse<{ message: string; category: { id: number; name: string } }>
> {
  try {
    const parsed = editCategorySchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, status: 400, error: "INVALID_CATEGORY_INPUT" };
    }

    const { id, name, slug, description } = parsed.data;

    const [existingCategory, categoryWithSameSlug] = await Promise.all([
      db.category.findUnique({ where: { id } }),
      db.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      }),
    ]);

    if (!existingCategory) {
      return { success: false, status: 404, error: "CATEGORY_NOT_FOUND" };
    }
    if (categoryWithSameSlug) {
      return {
        success: false,
        status: 400,
        error: "SLUG_CATEOGRY_ALREADY_EXISTS",
      };
    }

    const updatedCategory = await db.category.update({
      where: { id },
      data: { name, slug, description },
    });

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}/edit`);

    return {
      success: true,
      status: 200,
      data: {
        message: "CATEGORY_UPDATED_SUCCESS",
        category: { id: updatedCategory.id, name: updatedCategory.name },
      },
    };
  } catch (error: any) {
    console.error("Update category error:", error);
    if (error?.code === "P2002") {
      return {
        success: false,
        status: 400,
        error: "SLUG_CATEGORY_ALREADY_EXISTS",
      };
    }
    return { success: false, status: 500, error: "SERVER_ERROR" };
  }
}

export async function deleteCategory(
  data: DeleteCategoryInput,
): Promise<ActionResponse<{ message: string }>> {
  try {
    const parsed = deleteCategorySchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, status: 400, error: "INVALID_CATEGORY_INPUT" };
    }
    const { id } = parsed.data;

    const existingCategory = await db.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      return { success: false, status: 404, error: "CATEGORY_NOT_FOUND" };
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");

    return {
      success: true,
      status: 200,
      data: {
        message: "CATEGORY_DELETED_SUCCESS",
      },
    };
  } catch (error: any) {
    console.error("Delete category error:", error);
    if (error?.code === "P2003") {
      return {
        success: false,
        status: 400,
        error: "CATEGORY_IS_IN_USE_BY_COURSES",
      };
    }

    return { success: false, status: 500, error: "SERVER_ERROR" };
  }
}
