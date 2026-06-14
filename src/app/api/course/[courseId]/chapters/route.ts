import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";
import { saveChaptersSchema } from "@/features/courses/contants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId: rawCourseId } = await params;
    const courseId = Number(rawCourseId);
    if (isNaN(courseId)) return apiResponse.error("INVALID_ID", 400);

    const courseExists = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!courseExists) return apiResponse.error("COURSE_NOT_FOUND", 404);

    const chapters = await db.chapter.findMany({
      where: { courseId },
      orderBy: { sortOrder: "asc" },
      include: {
        lessons: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return apiResponse.success({ chapters }, 200);
  } catch (error: any) {
    console.error("Get chapters error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId: rawCourseId } = await params;
    const courseId = Number(rawCourseId);
    if (isNaN(courseId)) return apiResponse.error("INVALID_ID", 400);

    const body = await req.json().catch(() => null);
    if (!body) return apiResponse.error("INVALID_BODY", 400);

    const parsed = saveChaptersSchema.safeParse({ ...body, courseId });
    if (!parsed.success) return apiResponse.error("INVALID_INPUT", 400);

    const { chapters } = parsed.data;
    const existingCourse = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!existingCourse) return apiResponse.error("COURSE_NOT_FOUND", 404);

    await db.$transaction(async (tx) => {
      const dbChapters = await tx.chapter.findMany({
        where: { courseId },
        select: { id: true },
      });
      const dbChapterIds = dbChapters.map((c) => c.id);

      const keepChapterIds: number[] = [];
      for (const chapterData of chapters) {
        let chapterId: number;

        if (chapterData.id && dbChapterIds.includes(chapterData.id)) {
          chapterId = chapterData.id;
          await tx.chapter.update({
            where: { id: chapterId },
            data: {
              title: chapterData.title,
              sortOrder: chapterData.sortOrder,
            },
          });
          keepChapterIds.push(chapterId);
        } else {
          const newChapter = await tx.chapter.create({
            data: {
              courseId,
              title: chapterData.title,
              sortOrder: chapterData.sortOrder,
            },
          });
          console.log("else newChapter", newChapter);

          chapterId = newChapter.id;
          keepChapterIds.push(chapterId);
        }

        const dbLessons = await tx.lesson.findMany({
          where: { chapterId },
          select: { id: true },
        });
        const dbLessonIds = dbLessons.map((l) => l.id);
        const keepLessonIds: number[] = [];

        for (const lessonData of chapterData.lessons) {
          const minutesNumber = Number(lessonData.minutes) || 0;
          const secondsNumber = Number(lessonData.seconds) || 0;
          const totalDurationInSeconds = minutesNumber * 60 + secondsNumber;

          const lessonPayload = {
            chapterId: chapterId,
            title: lessonData.title,
            videoUrl: lessonData.videoUrl ?? null,
            duration: totalDurationInSeconds,
            isPreview: lessonData.isPreview,
            sortOrder: lessonData.sortOrder,
          };
          if (lessonData.id && dbLessonIds.includes(lessonData.id)) {
            await tx.lesson.update({
              where: { id: lessonData.id },
              data: lessonPayload,
            });
            keepLessonIds.push(lessonData.id);
          } else {
            const newLesson = await tx.lesson.create({
              data: lessonPayload,
            });
            keepLessonIds.push(newLesson.id);
          }
        }

        await tx.lesson.deleteMany({
          where: {
            chapterId: chapterId,
            id: { notIn: keepLessonIds },
          },
        });
      }
      await tx.chapter.deleteMany({
        where: {
          courseId,
          id: { notIn: keepChapterIds },
        },
      });

      // update course duration when adding or updating lesson duration for any chapter.
      const courseLessonsAggregate = await tx.lesson.aggregate({
        where: {
          chapter: {
            courseId: courseId,
          },
        },
        _sum: {
          duration: true,
        },
      });
      const totalCourseDuration = courseLessonsAggregate._sum.duration || 0;
      await tx.course.update({
        where: { id: courseId },
        data: {
          duration: totalCourseDuration,
        },
      });
    });

    const updatedChapters = await db.chapter.findMany({
      where: { courseId },
      orderBy: { sortOrder: "asc" },
      include: {
        lessons: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return apiResponse.success(
      { message: "COURSE_CONTENT_SAVED_SUCCESS", chapters: updatedChapters },
      200,
    );
  } catch (error: any) {
    console.error("Save chapters error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
