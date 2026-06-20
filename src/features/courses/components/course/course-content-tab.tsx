"use client";

import { useEffect, useState, useTransition } from "react";
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
import { ChapterType, LessonType } from "@/features/courses/contants";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import {
  getChaptersByCourseIdAction,
  saveChaptersAction,
} from "@/features/courses/actions";
import {
  createChapter,
  deleteChapter,
  updateChapter,
} from "@/features/courses/server-action";
import { Chapter, COURSE_MESSAGES_MAP } from "@/features/courses/contants-1";

export function CourseContentTab({
  courseId,
  initialChapters,
}: {
  courseId: number;
  initialChapters: Chapter[];
}) {
  const [isPending, startTransition] = useTransition();

  const { isSystemLocked, openAddChapter, isAddingChapter, closeAllInputs } =
    useCourseStore(
      useShallow((state) => ({
        isSystemLocked: state.isSystemLocked(),
        openAddChapter: state.openAddChapter,
        isAddingChapter: state.isAddingChapter,
        closeAllInputs: state.closeAllInputs,
      })),
    );

  const [newChapterTitle, setNewChapterTitle] = useState("");

  const [listLesson, setListLesson] = useState<{ [key: string]: LessonType[] }>(
    () => {
      const lessons: { [key: string]: LessonType[] } = {};
      initialChapters.forEach((chapter) => {
        lessons[`chapter-key-${chapter.id}`] = (chapter.lessons || []).map(
          (lesson: any) => ({
            id: lesson.id,
            chapterId: lesson.chapterId,
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            minutes: lesson.minutes,
            seconds: lesson.seconds,
            isPreview: lesson.isPreview,
            isNew: false,
            sortOrder: lesson.sortOrder,
          }),
        );
      });
      return lessons;
    },
  );

  const [chapterDetails, setChapterDetails] = useState<{
    [key: string]: ChapterType;
  }>(() => {
    const details: { [key: string]: ChapterType } = {};
    initialChapters.forEach((chapter) => {
      details[`chapter-key-${chapter.id}`] = {
        id: chapter.id,
        title: chapter.title,
        sortOrder: chapter.sortOrder,
        isNew: false,
      };
    });
    return details;
  });

  const [chapterOrder, setChapterOrder] = useState<string[]>(() =>
    initialChapters.map((chapter) => `chapter-key-${chapter.id}`),
  );

  // const [isPageLoading, setIsPageLoading] = useState(true);

  // const onAddChapter = () => {
  //   const newChapterKey = `chapter-key-${Date.now()}`;
  //   const newChapterId = Math.floor(Math.random() * 10000);
  //   setChapterDetails((prev) => ({
  //     ...prev,
  //     [newChapterKey]: {
  //       id: newChapterId,
  //       title: newChapterTitle.trim(),
  //       sortOrder: Object.keys(prev).length,
  //       isNew: true,
  //     },
  //   }));
  //   setListLesson((prev) => ({ ...prev, [newChapterKey]: [] }));
  //   setChapterOrder((prev) => [...prev, newChapterKey]);
  //   setNewChapterTitle("");
  //   closeAllInputs();
  // };

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
            title: newChapterTitle,
            sortOrder: Object.keys(prev).length,
            isNew: false,
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

  // const onUpdateChapter = (chapterKey: string, newTitle: string) => {
  //   setChapterDetails((prev) => ({
  //     ...prev,
  //     [chapterKey]: { ...prev[chapterKey], title: newTitle },
  //   }));
  //   closeAllInputs();
  // };

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

  const onAddLesson = (
    chapterKey: string,
    chapterId: number,
    formData: {
      title: string;
      videoUrl: string | null;
      minutes: string;
      seconds: string;
      isPreview: boolean;
    },
  ) => {
    const newLessonId = Math.floor(Math.random() * 100000);
    const currentLessons = listLesson[chapterKey] || [];

    const newLesson: LessonType = {
      id: newLessonId,
      isNew: true,
      chapterId: chapterId,
      sortOrder: currentLessons.length,
      ...formData,
    };

    setListLesson((prev) => ({
      ...prev,
      [chapterKey]: [...currentLessons, newLesson],
    }));
  };
  const onUpdateLesson = (
    chapterKey: string,
    lessonId: number,
    formData: {
      title: string;
      videoUrl: string | null;
      duration: number;
      isPreview: boolean;
    },
  ) => {
    setListLesson((prevItems) => {
      const currentLessons = prevItems[chapterKey] || [];

      const updatedLessons = currentLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...formData } : lesson,
      );

      return { ...prevItems, [chapterKey]: updatedLessons };
    });
  };

  const handleSaveLesson = (
    mode: "CREATE" | "EDIT",
    context: {
      chapterKey: string | null;
      chapterId: number | null;
      lessonId: number | null;
    },
    formData: any,
  ) => {
    console.log("mode", mode);
    console.log("formData", formData);

    const { chapterKey, chapterId, lessonId } = context;
    if (!chapterKey) return;
    if (mode === "CREATE") {
      if (!chapterId) return;
      onAddLesson(chapterKey, chapterId, formData);
    } else if (mode === "EDIT") {
      if (!lessonId) return;
      onUpdateLesson(chapterKey, lessonId, formData);
    }
  };

  const { execute: fetchChapters } = useAction(getChaptersByCourseIdAction, {
    onSuccess: ({ data }) => {
      // setIsPageLoading(false);
      if (data?.chapters) {
        const dbChapters = data.chapters;

        const details: { [key: string]: ChapterType } = {};
        const lessons: { [key: string]: LessonType[] } = {};
        const order: string[] = [];

        dbChapters.forEach((chapter: any) => {
          const chapterKey = `chapter-key-${chapter.id}`;
          order.push(chapterKey);

          details[chapterKey] = {
            id: chapter.id,
            title: chapter.title,
            sortOrder: chapter.sortOrder,
            isNew: false,
          };

          lessons[chapterKey] = (chapter.lessons || []).map((lesson: any) => {
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
              isNew: false,
            };
          });
        });

        setChapterDetails(details);
        setListLesson(lessons);
        setChapterOrder(order);
      }
    },
    onError: ({ error }: { error: any }) => {
      console.error("Fetch chapters failed", error);
      // setIsPageLoading(false);
      toast.error("Failed to load course content");
    },
  });

  const { execute: saveChapters, isExecuting: isSaving } = useAction(
    saveChaptersAction,
    {
      onSuccess: ({ data }: { data: any }) => {
        toast.success("Course content saved successfully");
        if (data?.chapters) {
          const dbChapters = data.chapters;
          const details: { [key: string]: ChapterType } = {};
          const lessons: { [key: string]: LessonType[] } = {};
          const order: string[] = [];

          dbChapters.forEach((chapter: any) => {
            const chapterKey = `chapter-key-${chapter.id}`;
            order.push(chapterKey);
            details[chapterKey] = {
              id: chapter.id,
              title: chapter.title,
              sortOrder: chapter.sortOrder,
              isNew: false,
            };

            lessons[chapterKey] = (chapter.lessons || []).map((lesson: any) => {
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
                isNew: false,
              };
            });
          });

          setChapterDetails(details);
          setListLesson(lessons);
          setChapterOrder(order);
        }
      },
      onError: ({ error }) => {
        console.log("Save chapters failed", error);
        toast.error("Failed to save course content");
      },
    },
  );

  const handleBulkSave = () => {
    const payload = {
      courseId,
      chapters: chapterOrder.map((chapterKey, chapterIndex) => {
        const chapter = chapterDetails[chapterKey];
        const lessonsForChapter = listLesson[chapterKey] || [];
        return {
          id: chapter.isNew ? null : chapter.id,
          title: chapter.title,
          sortOrder: chapterIndex,
          lessons: lessonsForChapter.map((lesson, lessonIndex) => ({
            id: lesson.isNew ? null : lesson.id,
            title: lesson.title,
            videoUrl: lesson.videoUrl || null,
            minutes: lesson.minutes,
            seconds: lesson.seconds,
            isPreview: lesson.isPreview,
            sortOrder: lessonIndex,
          })),
        };
      }),
    };
    console.log("payload", payload);
    saveChapters(payload);
  };

  // useEffect(() => {
  //   if (courseId) {
  //     fetchChapters({ courseId });
  //   }
  // }, [courseId]);
  // if (isPageLoading) {
  //   return (
  //     <div className="space-y-6 pt-4">
  //       <div className="flex justify-between items-center">
  //         <Skeleton className="h-6 w-48" />
  //         <Skeleton className="h-9 w-32" />
  //       </div>
  //       <Skeleton className="h-32 w-full" />
  //       <Skeleton className="h-32 w-full" />
  //     </div>
  //   );
  // }

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 z-50 bg-transparent cursor-wait" />
      )}

      <DragDropProvider
        sensors={[PointerSensor, KeyboardSensor]}
        onDragOver={(event) => {
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
        }}
        onDragEnd={(event) => {
          const { source } = event.operation;
          if (event.canceled || source?.type !== "column") return;
          setChapterOrder((columns) => move(columns, event));
        }}
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
                    chapterId={chapter.id}
                    chapterKey={chapterKey}
                    title={lesson.title}
                    index={lessonIndex}
                    chapterIndex={chapterIndex}
                    videoUrl={lesson.videoUrl}
                    minutes={lesson.minutes}
                    seconds={lesson.seconds}
                    isPreview={lesson.isPreview}
                    isNew={lesson.isNew}
                    sortOrder={lesson.sortOrder}
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
      <LessonDrawer handleSaveLesson={handleSaveLesson} />
      {/* <div className="absolute -top-15 right-0 flex justify-end items-center gap-2 pt-4">
        <Button
          className="cursor-pointer gap-2"
          type="button"
          disabled={isSaving}
          onClick={handleBulkSave}
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={15} />
          ) : (
            <Save size={15} />
          )}
          Save
        </Button>
      </div> */}
    </div>
  );
}
