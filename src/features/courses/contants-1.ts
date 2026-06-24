import * as z from "zod";
export type ActionResponse<T> =
  | { success: true; status: number; data: T }
  | { success: false; status: number; error: string };

export const COURSE_MESSAGES_MAP: Record<string, string> = {
  // --- Fetch ---
  FETCH_COURSE_LIST_ERROR: "Failed to load courses.",
  FETCH_CATEGORY_LIST_ERROR: "Failed to load categories.",
  FETCH_INSTRUCTOR_LIST_ERROR: "Failed to load instructors.",

  // --- Course ---
  CREATE_COURSE_INVALID_INPUT: "Invalid course details.",
  CATEGORY_NOT_FOUND: "Category not found.",
  INSTRUCTOR_NOT_FOUND: "Instructor not found.",
  COURSE_CREATED_SUCCESS: "Course created successfully.",
  SLUG_ALREADY_EXISTS: "Slug URL already taken.",
  COURSE_CREATION_FAILED: "Failed to create course.",

  // --- Chapter ---
  CREATE_CHAPTER_INVALID_INPUT: "Invalid chapter data.",
  COURSE_NOT_FOUND: "Course not found.",
  CHAPTER_NOT_FOUND: "Chapter not found.",
  CHAPTER_CREATED_SUCCESS: "Chapter created successfully.",
  CHAPTER_CREATION_FAILED: "Failed to create chapter.",
  UPDATE_CHAPTER_INVALID_INPUT: "Invalid chapter update data.",
  CHAPTER_UPDATED_SUCCESS: "Chapter updated successfully.",
  CHAPTER_UPDATE_FAILED: "Failed to update chapter.",
  CHAPTER_DELETED_SUCCESS: "Chapter deleted successfully.",
  CHAPTER_DELETE_FAILED: "Failed to delete chapter.",

  // --- Lesson ---
  CREATE_LESSON_INVALID_INPUT: "Invalid lesson data.",
  LESSON_CREATED_SUCCESS: "Lesson created successfully.",
  LESSON_CREATION_FAILED: "Failed to create lesson.",
  UPDATE_LESSON_INVALID_INPUT: "Invalid lesson data.",
  LESSON_UPDATED_SUCCESS: "Lesson updated successfully.",
  LESSON_UPDATE_FAILED: "Failed to update lesson.",
  LESSON_DELETED_SUCCESS: "Lesson deleted successfully.",
  LESSON_DELETE_FAILED: "Failed to delete lesson.",
  CHAPTER_REORDERED_SUCCESS: "Chapters reordered.",
  LESSON_REORDERED_SUCCESS: "Lessons reordered.",
  // --- System ---
  SERVER_ERROR: "Server error. Please try again.",
};
export type CourseTable = {
  id: number;
  title: string;
  slug: string;
  duration: number;
  level: string;
  isPublished: boolean;
  instructorName: string;
};

export type RawCourseFromDBTable = {
  id: number;
  title: string;
  slug: string;
  duration: number;
  level: string;
  isPublished: boolean;
  instructor: { name: string } | null;
};

export function formatCoursesTable(
  courses: RawCourseFromDBTable[],
): CourseTable[] {
  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    duration: course.duration,
    level: course.level,
    isPublished: course.isPublished,
    instructorName: course.instructor?.name ?? "—",
  }));
}
export const courseFeaturesList = [
  { value: "professional-certificate", label: "Professional certificate" },
  { value: "flexibl-learning-path", label: "Flexible learning path" },
  { value: "24/7-support", label: "24/7 support" },
  { value: "downloadable-materials", label: "Downloadable materials" },
];

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

  duration: z.number({ message: "Duration must be a number" }),

  instructorId: z
    .string()
    .min(1, { message: "Please assign an instructor to this course" }),

  status: z.string().optional(),
  thumbnailUrl: z.any().optional().nullable(),

  targetAudience: z
    .array(z.string().min(2, "Each target must be at least 2 characters"))
    .min(1, "Please add at least one target audience")
    .max(5, "You can add a maximum of 5 target audiences"),

  skillsGained: z
    .array(z.string().min(2, "Each skill must be at least 2 characters"))
    .min(1, "Please add at least one skill gained")
    .max(5, "You can add a maximum of 5 skill gained"),

  features: z
    .array(z.string())
    .min(1, "Please select at least one course feature")
    .max(3, "You can select a maximum of 3 features"),

  price: z
    .number({ message: "Price must be a valid number" })
    .min(0, { message: "Price must be greater than or equal to 0" }),
});

export type CreateCourseInput = z.infer<typeof courseFormSchema>;
export type UpdateCourseInput = z.infer<typeof courseFormSchema>;

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

// export const createChapterSchema = z.object({
//   courseId: z.number({ message: "Course ID is required" }),
//   title: z
//     .string()
//     .min(1, "Chapter title cannot be empty")
//     .max(255, "Chapter title is too long"),
// });

// export const updateChapterSchema = z.object({
//   id: z.number({ message: "Course ID is required" }),
//   title: z
//     .string()
//     .min(1, "Chapter title cannot be empty")
//     .max(255, "Chapter title is too long"),
// });
// export type CreateChapterInput = z.infer<typeof createChapterSchema>;
// export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;

export const lessonSchema = z.object({
  id: z.number(),
  chapterId: z.number(),
  title: z.string().min(1),
  videoUrl: z.string().nullish(),
  minutes: z.string().min(1),
  seconds: z.string().min(1),
  isPreview: z.boolean().default(false),
  sortOrder: z.number(),
});

export const lessonFormSchema = z.object({
  title: z.string().trim().min(1, "Lesson title cannot be empty"),
  videoUrl: z
    .string()
    .trim()
    .nullish()
    .or(
      z
        .url("Invalid video URL (must start with http:// or https://)")
        .max(0)
        .or(z.string()),
    ),
  minutes: z
    .string()
    .trim()
    .min(1, "Minutes cannot be empty")
    .regex(/^\d+$/, "Must be a positive integer"),

  seconds: z
    .string()
    .trim()
    .min(1, "Seconds cannot be empty")
    .regex(/^\d+$/, "Must be a positive integer")
    .refine((val) => parseInt(val, 10) <= 59, {
      message: "Seconds must be less than 60",
    }),
  isPreview: z.boolean(),
  sortOrder: z.number(),
});

export const chapterSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  sortOrder: z.number(),
  courseId: z.number(),
});

export const createChapterSchema = chapterSchema.omit({
  id: true,
  sortOrder: true,
});
export const updateChapterSchema = chapterSchema.omit({
  courseId: true,
  sortOrder: true,
});

const chapterResponseSchema = chapterSchema.extend({
  lessons: z.array(lessonSchema),
});

export type LessonType = z.infer<typeof lessonSchema>;
export type LessonFormType = z.infer<typeof lessonFormSchema>;

export type ChapterType = z.infer<typeof chapterSchema>;
export type ChapterResponseType = z.infer<typeof chapterResponseSchema>;
