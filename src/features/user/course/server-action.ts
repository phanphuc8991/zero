"use server";

import { auth } from "@/auth";
import {
  EnrolledCourseDTO,
  EnrollmentWithCourse,
  FilterParams,
} from "@/features/user/course/contants";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getEnrolledCourses(filters?: FilterParams): Promise<any> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "UNAUTHORIZED_ERROR" };
    }

    const enrollments: EnrollmentWithCourse[] = await db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: true,
            category: true,
            chapters: {
              include: {
                lessons: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    const completedProgress = await db.userProgress.findMany({
      where: {
        userId: userId,
        isCompleted: true,
      },
      select: { lessonId: true },
    });

    const completedLessonIds = new Set(
      completedProgress.map((p) => p.lessonId),
    );
    console.log("completedLessonIds", completedLessonIds);

    const courses: EnrolledCourseDTO[] = enrollments.map((enrollment) => {
      const course = enrollment.course;

      const allLessons = course.chapters.flatMap((ch) => ch.lessons);
      const totalLessonCount = allLessons.length;

      const completedLessonCount = allLessons.filter((l) =>
        completedLessonIds.has(l.id),
      ).length;

      const progressPercentage =
        totalLessonCount > 0
          ? Math.round((completedLessonCount / totalLessonCount) * 100)
          : 0;

      let progressStatus: EnrolledCourseDTO["progressStatus"] = "not-started";

      if (totalLessonCount > 0) {
        if (completedLessonCount === totalLessonCount)
          progressStatus = "completed";
        else if (completedLessonCount > 0) progressStatus = "in-progress";
      }

      return {
        enrollmentId: enrollment.id,
        pricePaid: Number(enrollment.pricePaid),
        enrolledAt: enrollment.createdAt.toISOString(),

        progressStatus,
        progressPercentage,
        totalLessonCount,
        completedLessonCount,

        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnailUrl: course.thumbnailUrl,
        description: course.description,
        price: Number(course.price),
        level: course.level,

        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),

        instructor: course.instructor
          ? {
              id: course.instructor.id,
              name: course.instructor.name,
            }
          : null,

        category: course.category
          ? {
              id: course.category.id,
              name: course.category.name,
            }
          : null,
      };
    });

    console.log("courses", courses);

    const filteredCourses =
      filters?.status && filters.status !== "all"
        ? courses.filter((c) => c.progressStatus === filters.status)
        : courses;

    console.log("courses", courses);
    return { success: true, data: filteredCourses };
  } catch (error) {
    console.error("Error in get list course user:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function getCourseDetail(slug: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "Unauthorized." };
    }

    const course = await db.course.findUnique({
      where: { slug: slug },
      include: {
        chapters: {
          orderBy: { sortOrder: "asc" },
          include: {
            lessons: {
              orderBy: { sortOrder: "asc" },
              select: {
                id: true,
                title: true,
                duration: true,
                videoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return { success: false, error: "Course not found." };
    }
    const completedProgress = await db.userProgress.findMany({
      where: {
        userId: userId,
        isCompleted: true,
        lesson: {
          chapter: { courseId: course.id },
        },
      },
      select: { lessonId: true },
    });

    const completedLessonIds = completedProgress.map((p: any) => p.lessonId);

    const serializedData = JSON.parse(
      JSON.stringify({
        ...course,
        completedLessonIds,
      }),
    );

    return { success: true, data: serializedData };
  } catch (error) {
    console.error("Error in getCourseDetail:", error);
    return { success: false, error: "Internal server error." };
  }
}

export async function markLessonCompleted(lessonId: number) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  try {
    await db.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
      },
    });

    revalidatePath(`/course/[courseId]`);

    return { success: true };
  } catch (error) {
    console.error("Lỗi server:", error);
    return { success: false, error: "Không thể cập nhật" };
  }
}
