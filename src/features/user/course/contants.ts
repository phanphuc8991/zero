import { Prisma } from "@prisma/client";

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
    avatarUrl: string;
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
