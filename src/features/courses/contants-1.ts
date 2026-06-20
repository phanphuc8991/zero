import * as z from "zod";
export type ActionResponse<T> =
  | { success: true; status: number; data: T }
  | { success: false; status: number; error: string };

export const COURSE_MESSAGES_MAP: Record<string, string> = {
  FETCH_COURSE_LIST_ERROR: "Failed to fetch the course list from the server.",
  FETCH_CATEGORY_LIST_ERROR:
    "Failed to fetch the category list from the server.",
  FETCH_INSTRUCTOR_LIST_ERROR:
    "Failed to fetch the instructor list from the server.",

  CREATE_COURSE_INVALID_INPUT:
    "The provided input data is invalid. Please check the form fields.",
  CATEGORY_NOT_FOUND: "The selected category does not exist in the system.",
  INSTRUCTOR_NOT_FOUND: "The assigned instructor could not be found.",
  COURSE_CREATED_SUCCESS: "The course has been successfully created and saved.",
  SLUG_ALREADY_EXISTS:
    "This slug URL is already taken. Please change the title or edit the slug.",

  COURSE_CREATION_FAILED:
    "An error occurred while creating the course on the server.",

  CREATE_CHAPTER_INVALID_INPUT:
    "The provided chapter data is invalid. Please check the input fields.",
  COURSE_NOT_FOUND:
    "The specified course could not be found or has been deleted.",
  CHAPTER_NOT_FOUND: "The requested chapter could not be found.",

  CHAPTER_CREATED_SUCCESS: "The chapter has been successfully created.",
  CHAPTER_CREATION_FAILED:
    "An error occurred while creating the chapter on the server.",
  UPDATE_CHAPTER_INVALID_INPUT: "The chapter update data is invalid.",
  CHAPTER_UPDATED_SUCCESS: "The chapter title has been successfully updated.",
  CHAPTER_UPDATE_FAILED:
    "An error occurred while updating the chapter on the server.",
  CHAPTER_DELETED_SUCCESS:
    "The chapter and its lessons have been successfully deleted.",
  CHAPTER_DELETE_FAILED:
    "An error occurred while deleting the chapter on the server.",
  SERVER_ERROR: "A critical server error occurred. Please try again later.",
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

export const createChapterSchema = z.object({
  courseId: z.number({ message: "Course ID is required" }),
  title: z
    .string()
    .min(1, "Chapter title cannot be empty")
    .max(255, "Chapter title is too long"),
});

export const updateChapterSchema = z.object({
  id: z.number({ message: "Course ID is required" }),
  title: z
    .string()
    .min(1, "Chapter title cannot be empty")
    .max(255, "Chapter title is too long"),
});
export type CreateChapterInput = z.infer<typeof createChapterSchema>;
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;

export const lessonSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  videoUrl: z.string().nullable().optional(),
  duration: z.number().default(0),
  minutes: z.string().min(1),
  seconds: z.string().min(1),
  isPreview: z.boolean().default(false),
  sortOrder: z.number(),
});

export const chapterSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  sortOrder: z.number(),
  lessons: z.array(lessonSchema),
});

export type Chapter = z.infer<typeof chapterSchema>;
