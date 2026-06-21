"use server";

import {
  ActionResponse,
  ChapterResponseType,
  courseFormSchema,
  createChapterSchema,
  CreateCourseInput,
  formatCoursesTable,
  lessonSchema,
  LessonType,
  updateChapterSchema,
  UpdateCourseInput,
} from "@/features/courses/contants-1";
import { db } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function getCourses() {
  try {
    const rawCourses = await db.course.findMany({
      orderBy: { id: "desc" },
      include: {
        instructor: {
          select: { name: true },
        },
      },
    });
    return formatCoursesTable(rawCourses);
  } catch (error) {
    console.error("Get courses error:", error);
    throw new Error("FETCH_COURSE_LIST_ERROR");
  }
}

export async function getCourseById(courseId: number): Promise<{ data: any }> {
  try {
    if (isNaN(courseId)) {
      throw new Error("INVALID_COURSE_ID");
    }
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });
    if (!course) {
      throw new Error("COURSE_NOT_FOUND");
    }
    return { data: course };
  } catch (error: any) {
    console.error("Get course by id error:", error);
    throw new Error(error.message || "FETCH_COURSE_BY_ID_ERROR");
  }
}

export async function createCourse(
  data: CreateCourseInput,
): Promise<ActionResponse<{ message: string; course: { id: number } }>> {
  try {
    const parsed = courseFormSchema.safeParse(data);
    if (!parsed.success)
      return {
        success: false,
        status: 400,
        error: "CREATE_COURSE_INVALID_INPUT",
      };
    const rawData = parsed.data;
    const categoryId = Number(rawData.categoryId);
    const instructorId = Number(rawData.instructorId);
    const isPublished = rawData.status === "published";

    const [categoryExists, instructorExists, courseWithSameSlug] =
      await Promise.all([
        db.category.findUnique({ where: { id: categoryId } }),
        db.instructor.findUnique({ where: { id: instructorId } }),
        db.course.findUnique({ where: { slug: rawData.slug } }),
      ]);

    if (!categoryExists)
      return { success: false, status: 404, error: "CATEGORY_NOT_FOUND" };
    if (!instructorExists)
      return { success: false, status: 404, error: "INSTRUCTOR_NOT_FOUND" };
    if (courseWithSameSlug)
      return { success: false, status: 400, error: "SLUG_ALREADY_EXISTS" };
    const course = await db.course.create({
      data: {
        title: rawData.title,
        slug: rawData.slug,
        description: rawData.description,
        level: rawData.level || "All Levels",
        duration: rawData.duration,
        categoryId,
        instructorId,
        isPublished,
        thumbnailUrl: rawData.thumbnailUrl || null,
        skillsGained: rawData.skillsGained || [],
        targetAudience: rawData.targetAudience || [],
        features: rawData.features || [],
      },
    });
    revalidatePath("/admin/courses");
    return {
      success: true,
      status: 201,
      data: {
        message: "COURSE_CREATED_SUCCESS",
        course: { id: course.id },
      },
    };
  } catch (error: any) {
    console.error("Create course error:", error);
    if (error?.code === "P2002") {
      return { success: false, status: 400, error: "SLUG_ALREADY_EXISTS" };
    }
    return { success: false, status: 500, error: "COURSE_CREATION_FAILED" };
  }
}

export async function updateCourse(
  courseId: number,
  data: UpdateCourseInput,
): Promise<ActionResponse<{ message: string; course: { id: number } }>> {
  try {
    if (isNaN(courseId)) {
      return { success: false, status: 400, error: "INVALID_COURSE_ID" };
    }
    const parsed = courseFormSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        error: "UPDATE_COURSE_INVALID_INPUT",
      };
    }
    const rawData = parsed.data;
    const categoryId = Number(rawData.categoryId);
    const instructorId = Number(rawData.instructorId);
    const isPublished = rawData.status === "published";
    const [existingCourse, categoryExists, instructorExists, slugConflict] =
      await Promise.all([
        db.course.findUnique({ where: { id: courseId } }),
        db.category.findUnique({ where: { id: categoryId } }),
        db.instructor.findUnique({ where: { id: instructorId } }),
        db.course.findFirst({
          where: {
            slug: rawData.slug,
            id: { not: courseId },
          },
        }),
      ]);
    if (!existingCourse) {
      return { success: false, status: 404, error: "COURSE_NOT_FOUND" };
    }
    if (!categoryExists) {
      return { success: false, status: 404, error: "CATEGORY_NOT_FOUND" };
    }
    if (!instructorExists) {
      return { success: false, status: 404, error: "INSTRUCTOR_NOT_FOUND" };
    }
    if (slugConflict) {
      return { success: false, status: 400, error: "SLUG_ALREADY_EXISTS" };
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        title: rawData.title,
        slug: rawData.slug,
        description: rawData.description,
        level: rawData.level || "All Levels",
        duration: rawData.duration,
        categoryId,
        instructorId,
        isPublished,
        thumbnailUrl: rawData.thumbnailUrl ?? null,
        skillsGained: rawData.skillsGained || [],
        targetAudience: rawData.targetAudience || [],
        features: rawData.features || [],
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      success: true,
      status: 200,
      data: {
        message: "COURSE_UPDATED_SUCCESS",
        course: { id: updatedCourse.id },
      },
    };
  } catch (error: any) {
    console.error("Update course error:", error);
    if (error?.code === "P2002") {
      return { success: false, status: 400, error: "SLUG_ALREADY_EXISTS" };
    }
    return { success: false, status: 500, error: "COURSE_UPDATE_FAILED" };
  }
}

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

export async function getInstructors() {
  try {
    const instructors = await db.instructor.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return instructors;
  } catch (error) {
    console.error("Get instructors error:", error);
    throw new Error("FETCH_INSTRUCTOR_LIST_ERROR");
  }
}

export async function uploadThumbnail(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "NO_FILE" };
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            forder: "courses/thumbnails",
          },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          },
        )
        .end(buffer);
    });
    return {
      success: true,
      url: (result as any).secure_url,
    };
  } catch (error) {
    return { success: false, error: "UPLOAD_FAILED" };
  }
}

export async function getChaptersByCourseId(
  courseId: number,
): Promise<ActionResponse<{ chapters: ChapterResponseType[] }>> {
  try {
    if (isNaN(courseId)) {
      return {
        success: false,
        status: 400,
        error: "INVALID_COURSE_ID",
      };
    }
    const courseExists = await db.course.findUnique({
      where: { id: courseId, deletedAt: null },
      select: { id: true },
    });

    if (!courseExists) {
      return {
        success: false,
        status: 404,
        error: "COURSE_NOT_FOUND",
      };
    }

    const chapters = await db.chapter.findMany({
      where: {
        courseId,
        deletedAt: null,
      },
      orderBy: { sortOrder: "asc" },
      include: {
        lessons: {
          where: { deletedAt: null },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    const formattedChapters = chapters.map((chapter) => ({
      id: chapter.id,
      courseId: courseId,
      title: chapter.title,
      sortOrder: chapter.sortOrder,
      lessons: chapter.lessons.map((lesson) => {
        const totalSeconds = lesson.duration || 0;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return {
          id: lesson.id,
          chapterId: lesson.chapterId,
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          minutes: String(mins),
          seconds: String(secs),
          isPreview: lesson.isPreview,
          sortOrder: lesson.sortOrder,
        };
      }),
    }));
    return {
      success: true,
      status: 200,
      data: { chapters: formattedChapters },
    };
  } catch (error) {
    console.error("Fetch chapters error:", error);
    return {
      success: false,
      status: 500,
      error: "SERVER_ERROR",
    };
  }
}

export async function createChapter(data: {
  title: string;
  courseId: number;
}): Promise<ActionResponse<{ message: string; chapter: { id: number } }>> {
  try {
    const parsed = createChapterSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        error: "CREATE_CHAPTER_INVALID_INPUT",
      };
    }
    const { courseId, title } = parsed.data;
    const existingCourse = await db.course.findUnique({
      where: { id: courseId, deletedAt: null },
      select: { id: true },
    });
    if (!existingCourse) {
      return {
        success: false,
        status: 404,
        error: "COURSE_NOT_FOUND",
      };
    }
    const maxSortOrderChapter = await db.chapter.aggregate({
      where: {
        courseId,
        deletedAt: null,
      },
      _max: {
        sortOrder: true,
      },
    });

    const nextSortOrder = (maxSortOrderChapter._max.sortOrder ?? -1) + 1;
    const chapter = await db.chapter.create({
      data: {
        courseId,
        title,
        sortOrder: nextSortOrder,
      },
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      success: true,
      status: 201,
      data: {
        message: "CHAPTER_CREATED_SUCCESS",
        chapter: { id: chapter.id },
      },
    };
  } catch (error) {
    console.error("Create chapter error:", error);
    return {
      success: false,
      status: 500,
      error: "CHAPTER_CREATION_FAILED",
    };
  }
}

export async function updateChapter(data: {
  id: number;
  title: string;
}): Promise<ActionResponse<{ message: string }>> {
  try {
    const parsed = updateChapterSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        error: "UPDATE_CHAPTER_INVALID_INPUT",
      };
    }
    const { id, title } = parsed.data;
    const existingChapter = await db.chapter.findUnique({
      where: { id, deletedAt: null },
      select: { id: true, courseId: true },
    });

    if (!existingChapter) {
      return {
        success: false,
        status: 404,
        error: "CHAPTER_NOT_FOUND",
      };
    }
    const courseId = existingChapter.courseId;
    await db.chapter.update({
      where: { id },
      data: { title },
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      success: true,
      status: 200,
      data: {
        message: "CHAPTER_UPDATED_SUCCESS",
      },
    };
  } catch (error) {
    console.error("Update chapter error:", error);
    return {
      success: false,
      status: 500,
      error: "SERVER_ERROR",
    };
  }
}

export async function deleteChapter(
  id: number,
): Promise<ActionResponse<{ message: string }>> {
  try {
    if (isNaN(id)) {
      return {
        success: false,
        status: 400,
        error: "INVALID_CHAPTER_ID",
      };
    }
    const existingChapter = await db.chapter.findUnique({
      where: { id, deletedAt: null },
      select: { id: true, courseId: true },
    });
    if (!existingChapter) {
      return {
        success: false,
        status: 404,
        error: "CHAPTER_NOT_FOUND",
      };
    }
    const now = new Date();
    const courseId = existingChapter.courseId;
    await db.$transaction(async (tx) => {
      await tx.chapter.update({
        where: { id },
        data: { deletedAt: now },
      });

      await tx.lesson.updateMany({
        where: { chapterId: id, deletedAt: null },
        data: { deletedAt: now },
      });

      const courseLessonsAggregate = await tx.lesson.aggregate({
        where: {
          chapter: {
            courseId: courseId,
            deletedAt: null,
          },
          deletedAt: null,
        },
        _sum: {
          duration: true,
        },
      });

      const totalCourseDuration = courseLessonsAggregate._sum.duration || 0;

      await tx.course.update({
        where: { id: courseId },
        data: { duration: totalCourseDuration },
      });
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      success: true,
      status: 200,
      data: {
        message: "CHAPTER_DELETED_SUCCESS",
      },
    };
  } catch (error) {
    console.error("chapter delete error:", error);
    return {
      success: false,
      status: 500,
      error: "SERVER_ERROR",
    };
  }
}

export async function createLesson(
  data: LessonType,
): Promise<ActionResponse<{ lesson: LessonType; message: string }>> {
  try {
    const parsed = lessonSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        error: "CREATE_LESSON_INVALID_INPUT",
      };
    }
    const {
      title,
      videoUrl,
      isPreview,
      sortOrder,
      minutes,
      seconds,
      chapterId,
    } = parsed.data;
    const chapterExists = await db.chapter.findUnique({
      where: { id: chapterId, deletedAt: null },
      select: { id: true, courseId: true },
    });

    if (!chapterExists) {
      return {
        success: false,
        status: 404,
        error: "CHAPTER_NOT_FOUND",
      };
    }
    const courseId = chapterExists.courseId;
    const mins = parseInt(minutes || "0", 10);
    const secs = parseInt(seconds || "0", 10);
    const totalSeconds = mins * 60 + secs;
    const newLesson = await db.$transaction(async (tx) => {
      const lesson = await tx.lesson.create({
        data: {
          chapterId,
          title: title.trim(),
          videoUrl: videoUrl || null,
          duration: totalSeconds,
          isPreview,
          sortOrder,
        },
      });
      const courseLessonsAggregate = await tx.lesson.aggregate({
        where: {
          chapter: {
            courseId: chapterExists.courseId,
            deletedAt: null,
          },
          deletedAt: null,
        },
        _sum: {
          duration: true,
        },
      });

      const totalCourseDuration = courseLessonsAggregate._sum.duration || 0;
      await tx.course.update({
        where: { id: chapterExists.courseId },
        data: { duration: totalCourseDuration },
      });

      return lesson;
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      success: true,
      status: 201,
      data: {
        lesson: {
          id: newLesson.id,
          title: newLesson.title,
          videoUrl: newLesson.videoUrl,
          chapterId,
          minutes,
          seconds,
          isPreview: newLesson.isPreview,
          sortOrder: newLesson.sortOrder,
        },
        message: "LESSON_CREATED_SUCCESS",
      },
    };
  } catch (error) {
    console.error("Create lesson error:", error);
    return {
      success: false,
      status: 500,
      error: "SERVER_ERROR",
    };
  }
}

export async function updateLesson(
  data: LessonType,
): Promise<ActionResponse<{ lesson: LessonType; message: string }>> {
  try {
    const parsed = lessonSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        error: "UPDATE_LESSON_INVALID_INPUT",
      };
    }
    const {
      title,
      videoUrl,
      isPreview,
      sortOrder,
      minutes,
      seconds,
      id: lessonId,
    } = parsed.data;
    const existingLesson = await db.lesson.findUnique({
      where: { id: lessonId, deletedAt: null },
      include: { chapter: true },
    });
    if (!existingLesson || existingLesson.chapter.deletedAt !== null) {
      return {
        success: false,
        status: 404,
        error: "LESSON_NOT_FOUND",
      };
    }
    const mins = parseInt(minutes || "0", 10);
    const secs = parseInt(seconds || "0", 10);
    const totalSeconds = mins * 60 + secs;
    const courseId = existingLesson.chapter.courseId;

    const updatedDbLesson = await db.$transaction(async (tx) => {
      const lesson = await tx.lesson.update({
        where: { id: lessonId },
        data: {
          title: title,
          videoUrl: videoUrl || null,
          duration: totalSeconds,
          isPreview,
          sortOrder,
        },
      });

      const courseLessonsAggregate = await tx.lesson.aggregate({
        where: {
          chapter: {
            courseId: courseId,
            deletedAt: null,
          },
          deletedAt: null,
        },
        _sum: {
          duration: true,
        },
      });

      const totalCourseDuration = courseLessonsAggregate._sum.duration || 0;

      await tx.course.update({
        where: { id: courseId },
        data: { duration: totalCourseDuration },
      });

      return lesson;
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      success: true,
      status: 200,
      data: {
        lesson: {
          id: updatedDbLesson.id,
          chapterId: updatedDbLesson.chapterId,
          title: updatedDbLesson.title,
          videoUrl: updatedDbLesson.videoUrl,
          minutes,
          seconds,
          isPreview: updatedDbLesson.isPreview,
          sortOrder: updatedDbLesson.sortOrder,
        },
        message: "LESSON_UPDATED_SUCCESS",
      },
    };
  } catch (error) {
    console.error("Update lesson error:", error);
    return {
      success: false,
      status: 500,
      error: "SERVER_ERROR",
    };
  }
}
