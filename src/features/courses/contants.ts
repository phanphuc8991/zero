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

  duration: z
    .number({ error: "Duration must be a number" })
    .min(1, { message: "Duration must be at least 1" }),

  instructorId: z
    .string()
    .min(1, { message: "Please assign an instructor to this course" }),

  status: z.string().optional(),
  thumbnailUrl: z.any().optional().nullable(),
});

export const courseByIdSchema = z.object({ courseId: z.number().min(1) });

export const editCourseSchema = courseFormSchema.extend({
  id: z.number().min(1, "Course ID is required"),
});

export type CourseFormInput = z.infer<typeof courseFormSchema>;
export type EditCourseInput = z.infer<typeof editCourseSchema>;

// ============ CHAPTER & LESSON ============

export const lessonPayloadSchema = z.object({
  id: z.number().nullable(),
  title: z.string().min(1),
  videoUrl: z.string().nullable().optional(),
  duration: z.number().default(0),
  isPreview: z.boolean().default(false),
  sortOrder: z.number(),
});

export const chapterPayloadSchema = z.object({
  id: z.number().nullable(),
  title: z.string().min(1),
  sortOrder: z.number(),
  lessons: z.array(lessonPayloadSchema),
});

export const saveChaptersSchema = z.object({
  courseId: z.number().min(1),
  chapters: z.array(chapterPayloadSchema),
});

export const getChaptersByCourseIdSchema = z.object({
  courseId: z.number().min(1),
});

export type LessonPayload = z.infer<typeof lessonPayloadSchema>;
export type ChapterPayload = z.infer<typeof chapterPayloadSchema>;
export type SaveChaptersInput = z.infer<typeof saveChaptersSchema>;

export interface LessonType {
  id: number;
  chapterId: number;
  title: string;
  videoUrl: string | null;
  duration: number;
  sortOrder: number;
  isPreview: boolean;
  isNew: boolean;
}

export interface ChapterType {
  id: number;
  title: string;
  sortOrder: number;
  isNew: boolean;
}
export type LessonResponse = Omit<LessonType, "isNew">;

export interface ChapterResponse extends Omit<ChapterType, "isNew"> {
  lessons: LessonResponse[];
}

export const lessonFormSchema = z.object({
  title: z.string().trim().min(1, "Lesson title cannot be empty"),
  videoUrl: z
    .string()
    .trim()
    .nullable()
    .or(
      z
        .url("Invalid video URL (must start with http:// or https://)")
        .max(0)
        .or(z.string()),
    ),
  duration: z
    .number({ error: "Duration must be a number" })
    .min(1, "Lesson duration must be greater than 0 seconds"),
  isPreview: z.boolean(),
});

export type LessonFormInput = z.infer<typeof lessonFormSchema>;

export type LessonTypeInitial = Omit<LessonType, "isNew">;

export const instructorFormSchema = z.object({
  name: z.string().min(1, { message: "Instructor name is required" }),
  title: z.string().min(1, { message: "Professional title is required" }),
  avatarUrl: z
    .url({ message: "Invalid avatar URL" })
    .optional()
    .or(z.literal("")),
  bio: z.string().optional(),
});

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

export const editInstructorSchema = instructorFormSchema.extend({
  id: z.number().min(1, "Instructor ID is required"),
});

export const deleteInstructorSchema = z.object({
  id: z.number().min(1, "Instructor ID is required"),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type EditCategoryInput = z.infer<typeof editCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;

export type InstructorFormInput = z.infer<typeof instructorFormSchema>;
export type EditInstructorInput = z.infer<typeof editInstructorSchema>;
export type DeleteInstructorInput = z.infer<typeof deleteInstructorSchema>;

export interface Instructor {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}
