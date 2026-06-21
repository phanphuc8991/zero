"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useShallow } from "zustand/react/shallow";
import { Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChapterColumn } from "@/features/courses/components/chapter/chapter";
import { LessonItem } from "@/features/courses/components/lesson/lesson";
import { DragDropProvider } from "@dnd-kit/react";
import { PointerSensor, KeyboardSensor } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import { useCourseStore } from "@/stores/useCourseStore";
import { LessonDrawer } from "@/features/courses/components/lesson/lesson-drawer";
import { toast } from "sonner";
import {
  createChapter,
  createLesson,
  deleteChapter,
  deleteLesson,
  reorderChapters,
  reorderLessons,
  updateChapter,
  updateLesson,
} from "@/features/courses/server-action";
import {
  ChapterResponseType,
  ChapterType,
  COURSE_MESSAGES_MAP,
  LessonFormType,
  LessonType,
} from "@/features/courses/contants-1";

export function CourseContentTab({
  courseId,
  initialChapters,
}: {
  courseId: number;
  initialChapters: ChapterResponseType[];
}) {
  const [isPending, startTransition] = useTransition();
  const {
    isSystemLocked,
    openAddChapter,
    isAddingChapter,
    closeAllInputs,
    activeChapterKey,
    activeChapterId,
    closeLessonDrawer,
    editingLessonData,
  } = useCourseStore(
    useShallow((state) => ({
      isSystemLocked: state.isSystemLocked(),
      openAddChapter: state.openAddChapter,
      isAddingChapter: state.isAddingChapter,
      closeAllInputs: state.closeAllInputs,
      activeChapterKey: state.activeChapterKey,
      activeChapterId: state.activeChapterId,
      closeLessonDrawer: state.closeLessonDrawer,
      lessonDrawerMode: state.lessonDrawerMode,
      editingLessonData: state.editingLessonData,
    })),
  );
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const backupLessonsRef = useRef<LessonType[] | null>(null);

  const [listLesson, setListLesson] = useState<{
    [key: string]: LessonType[];
  }>(() => {
    const lessons: { [key: string]: LessonType[] } = {};
    initialChapters.forEach((chapter) => {
      lessons[`chapter-key-${chapter.id}`] = (chapter.lessons || []).map(
        (lesson) => ({
          id: lesson.id,
          chapterId: chapter.id,
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          minutes: lesson.minutes,
          seconds: lesson.seconds,
          isPreview: lesson.isPreview,
          sortOrder: lesson.sortOrder,
        }),
      );
    });
    return lessons;
  });
  const [chapterDetails, setChapterDetails] = useState<{
    [key: string]: ChapterType;
  }>(() => {
    const details: { [key: string]: ChapterType } = {};
    initialChapters.forEach((chapter) => {
      details[`chapter-key-${chapter.id}`] = {
        id: chapter.id,
        courseId: courseId,
        title: chapter.title,
        sortOrder: chapter.sortOrder,
      };
    });
    return details;
  });

  const [chapterOrder, setChapterOrder] = useState<string[]>(() =>
    initialChapters.map((chapter) => `chapter-key-${chapter.id}`),
  );
  console.log("chapterOrder", chapterOrder);
  const onAddChapter = () => {
    startTransition(async () => {
      try {
        const result = await createChapter({
          courseId,
          title: newChapterTitle.trim(),
        });
        if (!result.success) {
          toast.error(COURSE_MESSAGES_MAP[result.error]);
          return;
        }
        const realChapterId = result.data.chapter.id;
        const newChapterKey = `chapter-key-${realChapterId}`;
        setChapterDetails((prev) => ({
          ...prev,
          [newChapterKey]: {
            id: realChapterId,
            courseId: courseId,
            title: newChapterTitle,
            sortOrder: Object.keys(prev).length,
          },
        }));
        setListLesson((prev) => ({ ...prev, [newChapterKey]: [] }));
        setChapterOrder((prev) => [...prev, newChapterKey]);
        setNewChapterTitle("");
        closeAllInputs();
        toast.success(COURSE_MESSAGES_MAP[result.data.message]);
      } catch (error) {
        console.error("Chapter creation failed", error);
        toast.error(COURSE_MESSAGES_MAP["CHAPTER_CREATION_FAILED"]);
      }
    });
  };

  const onUpdateChapter = (chapterKey: string, newTitle: string) => {
    const chapter = chapterDetails[chapterKey];
    startTransition(async () => {
      try {
        const result = await updateChapter({
          id: chapter.id,
          title: newTitle,
        });
        if (!result.success) {
          toast.error(COURSE_MESSAGES_MAP[result.error]);
          return;
        }
        setChapterDetails((prev) => ({
          ...prev,
          [chapterKey]: { ...prev[chapterKey], title: newTitle },
        }));
        closeAllInputs();
        toast.success(COURSE_MESSAGES_MAP[result.data.message]);
      } catch (error) {
        console.error("Chapter update failed", error);
        toast.error(COURSE_MESSAGES_MAP["CHAPTER_UPDATE_FAILED"]);
      }
    });
  };

  const onDeleteChapter = (chapterKey: string) => {
    const chapter = chapterDetails[chapterKey];
    startTransition(async () => {
      try {
        const result = await deleteChapter(chapter.id);
        if (!result.success) {
          toast.error(COURSE_MESSAGES_MAP[result.error]);
          return;
        }
        setChapterOrder((prev) => prev.filter((item) => item !== chapterKey));
        setListLesson((prev) => {
          const { [chapterKey]: removed, ...rest } = prev;
          return rest;
        });
        setChapterDetails((prev) => {
          const { [chapterKey]: removed, ...rest } = prev;
          return rest;
        });
        toast.success(COURSE_MESSAGES_MAP[result.data.message]);
      } catch (error) {
        console.error("delete chapter failed:", error);
        toast.error(COURSE_MESSAGES_MAP["CHAPTER_DELETE_FAILED"]);
      }
    });
  };

  const onAddLesson = (formData: LessonFormType) => {
    startTransition(async () => {
      try {
        if (!activeChapterKey || !activeChapterId) {
          throw new Error("LESSON_CREATION_FAILED");
        }
        const currentLessons = listLesson[activeChapterKey] || [];
        const data = {
          ...formData,
          id: 0,
          chapterId: activeChapterId,
          sortOrder: currentLessons.length,
        };
        const result = await createLesson(data);
        if (!result.success) {
          toast.error(COURSE_MESSAGES_MAP[result.error]);
          return;
        }
        const serverLesson = result.data.lesson as LessonType;
        setListLesson((prev) => ({
          ...prev,
          [activeChapterKey]: [...currentLessons, { ...serverLesson }],
        }));
        closeLessonDrawer();
        toast.success(COURSE_MESSAGES_MAP[result.data.message]);
      } catch (error) {
        console.error("Lesson creation failed:", error);
        toast.error(COURSE_MESSAGES_MAP["LESSON_CREATION_FAILED"]);
      }
    });
  };

  const onUpdateLesson = (data: LessonFormType) => {
    console.log("onUpdateLesson");
    startTransition(async () => {
      if (!activeChapterId || !editingLessonData?.id || !activeChapterKey) {
        throw new Error("LESSON_CREATION_FAILED");
      }
      try {
        const result = await updateLesson({
          ...data,
          id: editingLessonData.id,
          chapterId: activeChapterId,
        });
        if (!result.success) {
          toast.error(COURSE_MESSAGES_MAP[result.error]);
          return;
        }
        const serverLesson = result.data.lesson;
        setListLesson((prevItems) => {
          const currentLessons = prevItems[activeChapterKey] || [];

          const updatedLessons = currentLessons.map((lesson) =>
            lesson.id === editingLessonData?.id
              ? { ...serverLesson, isNew: false }
              : lesson,
          );
          return { ...prevItems, [activeChapterKey]: updatedLessons };
        });
        toast.success(COURSE_MESSAGES_MAP[result.data.message]);
        closeLessonDrawer();
      } catch (error) {
        console.error("Update lesson failed:", error);
        toast.error(COURSE_MESSAGES_MAP["LESSON_UPDATE_FAILED"]);
      }
    });
  };

  const onDeleteLesson = (chapterKey: string, lessonId: number) => {
    startTransition(async () => {
      try {
        const result = await deleteLesson(lessonId);

        if (!result.success) {
          toast.error(COURSE_MESSAGES_MAP[result.error]);
          return;
        }

        setListLesson((prevItems) => {
          const currentLessons = prevItems[chapterKey] || [];
          const filteredLessons = currentLessons.filter(
            (lesson) => lesson.id !== lessonId,
          );

          return {
            ...prevItems,
            [chapterKey]: filteredLessons,
          };
        });

        toast.success(COURSE_MESSAGES_MAP[result.data.message]);
      } catch (error) {
        console.error("Lesson delete failed", error);
        toast.error(COURSE_MESSAGES_MAP["LESSON_DELETE_FAILED"]);
      }
    });
  };

  // console.log("chapterDetails", chapterDetails);
  // console.log("listLesson", listLesson);
  // console.log("chapterOrder", chapterOrder);

  const onDragStart = useCallback(
    (event: any) => {
      const { source } = event.operation;
      if (!source || source.type === "column") return;

      const targetChapterKey = Object.keys(listLesson).find((key) =>
        listLesson[key].some((lesson) => lesson.id === source.id),
      );

      if (targetChapterKey) {
        backupLessonsRef.current = [...(listLesson[targetChapterKey] || [])];
      }
    },
    [listLesson],
  );

  const onDragOver = useCallback(
    (event: any) => {
      const { source, target } = event.operation;
      if (source?.type === "column" || target?.type === "column") return;

      if (source && target) {
        const sourceChapterKey = Object.keys(listLesson).find((key) =>
          listLesson[key].some((lesson) => lesson.id === source.id),
        );
        const targetChapterKey = Object.keys(listLesson).find((key) =>
          listLesson[key].some((lesson) => lesson.id === target.id),
        );
        if (sourceChapterKey !== targetChapterKey) return;
      }

      setListLesson((prevItems) => move(prevItems, event));
    },
    [listLesson],
  );

  const onDragEnd = useCallback(
    (event: any) => {
      const { source, target } = event.operation;
      if (event.canceled) {
        backupLessonsRef.current = null;
        return;
      }

      if (source?.type === "column") {
        const backupOrder = [...chapterOrder];
        const nextOrder = move(chapterOrder, event);
        setChapterOrder(nextOrder);

        const reorderPayload = nextOrder.map((chapterKey, index) => {
          const chapter = chapterDetails[chapterKey];
          return {
            id: chapter.id,
            sortOrder: index,
          };
        });

        startTransition(async () => {
          try {
            const result = await reorderChapters(courseId, reorderPayload);
            if (!result.success) {
              toast.error(COURSE_MESSAGES_MAP[result.error]);
              setChapterOrder(backupOrder);
              return;
            }
            toast.success(COURSE_MESSAGES_MAP[result.data.message]);
          } catch (error) {
            console.error("Reorder chapters failed:", error);
            toast.error(COURSE_MESSAGES_MAP["SERVER_ERROR"]);
            setChapterOrder(backupOrder);
          }
        });
        return;
      }

      if (source && target) {
        const targetChapterKey = Object.keys(listLesson).find((key) =>
          listLesson[key].some((lesson) => lesson.id === source.id),
        );
        if (!targetChapterKey) {
          backupLessonsRef.current = null;
          return;
        }

        const targetChapterId = chapterDetails[targetChapterKey]?.id;
        if (!targetChapterId) {
          backupLessonsRef.current = null;
          return;
        }

        const updatedLessons = listLesson[targetChapterKey] || [];
        const reorderPayload = updatedLessons.map((lesson, index) => ({
          id: lesson.id,
          sortOrder: index,
        }));

        startTransition(async () => {
          try {
            const result = await reorderLessons(
              courseId,
              targetChapterId,
              reorderPayload,
            );

            if (!result.success) {
              toast.error(COURSE_MESSAGES_MAP[result.error]);
              if (backupLessonsRef.current) {
                setListLesson((prev) => ({
                  ...prev,
                  [targetChapterKey]: backupLessonsRef.current!,
                }));
              }
              return;
            }
            toast.success(COURSE_MESSAGES_MAP[result.data.message]);
          } catch (error) {
            console.error("Reorder lessons failed:", error);
            toast.error(COURSE_MESSAGES_MAP["SERVER_ERROR"]);
            if (backupLessonsRef.current) {
              setListLesson((prev) => ({
                ...prev,
                [targetChapterKey]: backupLessonsRef.current!,
              }));
            }
          } finally {
            backupLessonsRef.current = null;
          }
        });
      }
    },
    [chapterOrder, chapterDetails, listLesson, courseId],
  );

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 z-50 bg-transparent cursor-wait" />
      )}

      <DragDropProvider
        sensors={[PointerSensor, KeyboardSensor]}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex flex-col gap-4 pt-4">
          {chapterOrder.length === 0 && (
            <div className="border border-dashed p-20 flex justify-center items-center rounded-lg">
              <div className="flex flex-col items-center gap-1 text-center">
                <h4 className="text-muted-foreground font-medium">
                  No chapters yet
                </h4>
                <p className="text-muted-foreground text-sm">
                  Start building your course by adding your first chapter below.
                </p>
              </div>
            </div>
          )}

          {chapterOrder.map((chapterKey, chapterIndex) => {
            const chapter = chapterDetails[chapterKey];
            const lessons = listLesson[chapterKey] || [];
            return (
              <ChapterColumn
                key={chapterKey}
                chapterKey={chapterKey}
                index={chapterIndex}
                title={chapter.title}
                chapterId={chapter.id}
                lessonCount={lessons.length}
                onUpdateChapter={onUpdateChapter}
                onDeleteChapter={onDeleteChapter}
                isPending={isPending}
              >
                {lessons.map((lesson, lessonIndex) => (
                  <LessonItem
                    key={lesson.id}
                    lessonId={lesson.id}
                    chapterId={lesson.chapterId}
                    chapterKey={chapterKey}
                    title={lesson.title}
                    index={lessonIndex}
                    chapterIndex={chapterIndex}
                    videoUrl={lesson.videoUrl}
                    minutes={lesson.minutes}
                    seconds={lesson.seconds}
                    isPreview={lesson.isPreview}
                    sortOrder={lesson.sortOrder}
                    isPending={isPending}
                    onDeleteLesson={onDeleteLesson}
                  />
                ))}
              </ChapterColumn>
            );
          })}
        </div>

        {isAddingChapter ? (
          <div className="mt-6 flex flex-col gap-2 p-4 border rounded-lg bg-background">
            <Input
              autoFocus
              placeholder="Enter a new chapter title... (e.g., Chapter 3: Advanced Hooks)"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  closeAllInputs();
                  setNewChapterTitle("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onAddChapter}
                disabled={!newChapterTitle.trim() || isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  <Save size={15} />
                )}
                Save
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            disabled={isSystemLocked}
            className="mt-6 gap-2 w-full h-12 cursor-pointer"
            onClick={openAddChapter}
          >
            <Plus size={15} />
            Add chapter
          </Button>
        )}
      </DragDropProvider>
      <LessonDrawer
        isPending={isPending}
        onAddLesson={onAddLesson}
        onUpdateLesson={onUpdateLesson}
      />
    </div>
  );
}
