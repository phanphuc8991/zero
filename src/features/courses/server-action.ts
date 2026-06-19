"use server";

import {
  ActionResponse,
  courseFormSchema,
  CreateCourseInput,
  formatCoursesTable,
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
export async function createCourseAction(
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

export async function uploadThumbnailAction(formData: FormData) {
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
