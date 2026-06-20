import * as z from "zod";
export const CATEGORY_MESSAGES_MAP: Record<string, string> = {
  SERVER_ERROR: "A critical server error occurred. Please try again later.",
  INVALID_CATEGORY_INPUT:
    "The provided input data is invalid. Please check the form fields.",
  FETCH_CATEGORY_LIST_ERROR:
    "Failed to fetch the category list from the server.",
  CATEGORY_NOT_FOUND: "The selected category does not exist in the system.",
  SLUG_ALREADY_EXISTS:
    "This slug URL is already taken. Please change the title or edit the slug.",
  CATEGORY_IS_IN_USE_BY_COURSES:
    "Cannot delete this category because it is currently linked to one or more courses.",
  CATEGORY_CREATED_SUCCESS: "The category has been successfully created.",
  CATEGORY_UPDATED_SUCCESS: "The category has been successfully updated.",
  CATEGORY_DELETED_SUCCESS: "The category has been successfully deleted.",
};
export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug URL path is required" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  description: z.string().optional(),
});

export const deleteCategorySchema = z.object({
  id: z.number().min(1, "Category ID is required"),
});

export const editCategorySchema = categoryFormSchema.extend({
  id: z.number().min(1, "Category ID is required"),
});

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type EditCategoryInput = z.infer<typeof editCategorySchema>;

export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
