import { ChapterType } from "@/features/courses/contants-1";
import { Prisma } from "@prisma/client";

export const USER_COURSE_MESSAGES_MAP: Record<string, string> = {
  // --- Auth ---
  UNAUTHORIZED_ERROR: "Unauthorized. Please sign in.",
  SERVER_ERROR: "Server error. Please try again.",
};

export interface FilterParams {
  status?: "all" | "not-started" | "in-progress" | "completed";
}
export type EnrollmentWithCourse = Prisma.EnrollmentGetPayload<{
  include: {
    course: {
      include: {
        instructor: true;
        category: true;
        chapters: {
          include: {
            lessons: { select: { id: true } };
          };
        };
      };
    };
  };
}>;

export type EnrolledCourseDTO = {
  enrollmentId: number;
  pricePaid: number;
  enrolledAt: string;

  progressStatus: "not-started" | "in-progress" | "completed";
  progressPercentage: number;
  totalLessonCount: number;
  completedLessonCount: number;

  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  description: string | null;
  price: number;
  level: string;

  createdAt: string;
  updatedAt: string;

  instructor: { id: number; name: string; avatarUrl?: string } | null;
  category: { id: number; name: string } | null;
};
