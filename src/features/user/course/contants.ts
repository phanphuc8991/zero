import { Prisma } from "@prisma/client";
import { AnyARecord } from "node:dns";

export const USER_COURSE_MESSAGES_MAP: Record<string, string> = {
  // --- Auth ---
  UNAUTHORIZED_ERROR: "Unauthorized. Please sign in.",
  SERVER_ERROR: "Server error. Please try again.",
  COURSE_NOT_FOUND: "Course not found.",
};

export interface FilterParams {
  status?: "all" | "not-started" | "in-progress" | "completed";
}

export type EnrollmentWithCoursePrisma = Prisma.EnrollmentGetPayload<{
  select: {
    courseId: true;
    id: true;

    user: true;

    course: {
      select: {
        id: true;
        title: true;
        slug: true;
        thumbnailUrl: true;
        description: true;
        duration: true;

        instructor: {
          select: {
            id: true;
            name: true;
            avatarUrl: true;
          };
        };

        category: {
          select: {
            id: true;
            name: true;
          };
        };

        chapters: {
          select: {
            id: true;
            lessons: {
              select: {
                id: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type EnrollmentCourseDTO = {
  enrollmentId: number;

  progressStatus: "not-started" | "in-progress" | "completed";
  progressPercentage: number;
  totalLessonCount: number;
  completedLessonCount: number;

  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  description: string | null;

  instructor: {
    id: number;
    name: string;
    avatarUrl: string | null;
  } | null;

  category: {
    id: number;
    name: string;
  } | null;
};

export type DetailCoursePrisma = Prisma.CourseGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    thumbnailUrl: true;
    description: true;
    duration: true;
    level: true;

    skillsGained: true;
    targetAudience: true;
    features: true;

    chapters: {
      select: {
        id: true;
        courseId: true;
        title: true;
        sortOrder: true;

        lessons: {
          select: {
            id: true;
            title: true;
            duration: true;
            videoUrl: true;
          };
        };
      };
    };
  };
}>;

export type CompletedProgressPrisma = Prisma.UserProgressGetPayload<{
  select: {
    lessonId: true;
  };
}>;

export type DetailCourseDto = DetailCoursePrisma & {
  completedLessonIds: number[];
};

export const transformCourseData = (course: any, completedLessonIds: any) => {
  const completedSet = new Set(completedLessonIds);
  const allLessons = course.chapters.flatMap((ch: any) => ch.lessons);
  const firstUnfinishedIndex = allLessons.findIndex(
    (l: any) => !completedSet.has(l.id),
  );
  const firstLesson =
    firstUnfinishedIndex !== -1
      ? allLessons[firstUnfinishedIndex]
      : allLessons[allLessons.length - 1];

  const chapters = course.chapters.map((chapter: any) => {
    const totalLessons = chapter.lessons.length;
    const completedLessons = chapter.lessons.filter((l: any) =>
      completedSet.has(l.id),
    ).length;

    const lessons = chapter.lessons.map((lesson: any) => {
      const currentIndex = allLessons.findIndex((l: any) => l.id === lesson.id);
      let status = "locked";
      if (completedSet.has(lesson.id)) {
        console.log("lesson.id", lesson);
        status = "done";
      } else if (currentIndex === firstUnfinishedIndex) {
        status = "available";
      } else if (currentIndex < firstUnfinishedIndex) {
        status = "done";
      }
      return { ...lesson, status };
    });

    return { ...chapter, totalLessons, completedLessons, lessons };
  });

  const totalLessons = allLessons.length;
  const progress =
    totalLessons > 0
      ? Math.round((completedLessonIds.length / totalLessons) * 100)
      : 0;

  return {
    ...course,
    chapters,
    totalLessons,
    completedLessons: completedLessonIds.length,
    progress,
    firstLesson,
  };
};
