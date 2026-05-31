import * as z from "zod";
export const courseFormSchema = z.object({
  title: z.string().min(1, { message: "Course title is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug URL path is required" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  description: z.string().optional(),

  categoryId: z.string().min(1, { message: "Please select a course category" }),

  level: z.string().optional(),

  durationHours: z
    .number({ error: "Duration must be a number" })
    .min(1, { message: "Duration must be at least 1 hour" }),

  instructorId: z
    .string()
    .min(1, { message: "Please assign an instructor to this course" }),

  includeCertificate: z.boolean().optional(),
  openEnrollment: z.boolean().optional(),
  status: z.string().optional(),
});
export type CourseFormInput = z.infer<typeof courseFormSchema>;

export const instructorFormSchema = z.object({
  name: z.string().min(1, { message: "Instructor name is required" }),
  title: z.string().min(1, { message: "Professional title is required" }), // Ví dụ: AI Content Strategist
  avatarUrl: z
    .url({ message: "Invalid avatar URL" })
    .optional()
    .or(z.literal("")),
  bio: z.string().optional(),
});

export type InstructorFormInput = z.infer<typeof instructorFormSchema>;

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

export const editCategorySchema = categoryFormSchema.extend({
  id: z.number().min(1, "Category ID is required"),
});
export const deleteCategorySchema = z.object({
  id: z.number().min(1, "Category ID is required"),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type EditCategoryInput = z.infer<typeof editCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}
