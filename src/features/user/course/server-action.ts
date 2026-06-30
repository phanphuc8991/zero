"use server";

import { auth } from "@/auth";
import {
  EnrollmentCourseDTO,
  EnrollmentWithCoursePrisma,
  DetailCoursePrisma,
  FilterParams,
  CompletedProgressPrisma,
  DetailCourseDto,
  transformCourseData,
} from "@/features/user/course/contants";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getEnrolledCourses(filters?: FilterParams): Promise<any> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "UNAUTHORIZED_ERROR" };
    }

    const enrollments: EnrollmentWithCoursePrisma[] =
      await db.enrollment.findMany({
        where: { userId },
        select: {
          courseId: true,
          id: true,
          user: true,
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnailUrl: true,
              description: true,
              duration: true,
              instructor: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
              chapters: {
                select: {
                  id: true,
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

    const courses: EnrollmentCourseDTO[] = enrollments.map((enrollment) => {
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

      let progressStatus: EnrollmentCourseDTO["progressStatus"] = "not-started";

      if (totalLessonCount > 0) {
        if (completedLessonCount === totalLessonCount)
          progressStatus = "completed";
        else if (completedLessonCount > 0) progressStatus = "in-progress";
      }

      return {
        enrollmentId: enrollment.id,
        progressStatus,
        progressPercentage,
        totalLessonCount,
        completedLessonCount,
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnailUrl: course.thumbnailUrl,
        description: course.description,
        instructor: course.instructor
          ? {
              id: course.instructor.id,
              name: course.instructor.name,
              avatarUrl: course.instructor.avatarUrl,
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

    const filteredCourses =
      filters?.status && filters.status !== "all"
        ? courses.filter((c) => c.progressStatus === filters.status)
        : courses;

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
      return { success: false, error: "UNAUTHORIZED_ERROR" };
    }

    const course: DetailCoursePrisma | null = await db.course.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnailUrl: true,
        description: true,
        duration: true,
        level: true,
        skillsGained: true,
        targetAudience: true,
        features: true,
        chapters: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            courseId: true,
            title: true,
            sortOrder: true,

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
      return { success: false, error: "COURSE_NOT_FOUND" };
    }

    const completedProgress: CompletedProgressPrisma[] =
      await db.userProgress.findMany({
        where: {
          userId: userId,
          isCompleted: true,
          lesson: {
            chapter: { courseId: course.id },
          },
        },
        select: { lessonId: true },
      });
    const completedLessonIds = completedProgress.map(
      (p: CompletedProgressPrisma) => p.lessonId,
    );

    const transformData = transformCourseData(course, completedLessonIds);
    return { success: true, data: transformData };
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
    revalidatePath("/user/courses/new-course");
    return { success: true };
  } catch (error) {
    console.error("Lỗi server:", error);
    return { success: false, error: "Không thể cập nhật" };
  }
}
