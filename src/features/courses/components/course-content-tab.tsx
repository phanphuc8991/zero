"use client";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChapterColumn } from "@/features/courses/components/chapter-column";
import { LessonItem } from "@/features/courses/components/lesson-item";
import { DragDropProvider } from "@dnd-kit/react";
import { PointerSensor, KeyboardSensor } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import { useCourseStore } from "@/stores/useCourseStore";

interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  videoUrl: string | null;
  duration: number;
  sortOrder: number;
  isPreview: boolean;
}

interface ChapterInfo {
  id: number;
  title: string;
  sortOrder: number;
}

export function CourseContentTab() {
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

  const [listLesson, setListLesson] = useState<{ [key: string]: Lesson[] }>({});

  const [chapterDetails, setChapterDetails] = useState<{
    [key: string]: ChapterInfo;
  }>({});

  const [chapterOrder, setChapterOrder] = useState<string[]>([]);

  console.log("newChapterTitle", newChapterTitle);
  console.log("listLesson", listLesson);
  console.log("chapterDetails", chapterDetails);
  console.log("chapterOrder", chapterOrder);

  const onUpdateChapter = (chapterKey: string, newTitle: string) => {
    setChapterDetails((prev) => ({
      ...prev,
      [chapterKey]: { ...prev[chapterKey], title: newTitle },
    }));
    closeAllInputs();
  };

  const onAddChapter = () => {
    const newChapterKey = `chapter-key-${Date.now()}`;
    const newChapterId = Math.floor(Math.random() * 10000);
    setChapterDetails((prev) => ({
      ...prev,
      [newChapterKey]: {
        id: newChapterId,
        title: newChapterTitle.trim(),
        sortOrder: Object.keys(prev).length,
      },
    }));
    setListLesson((prev) => ({ ...prev, [newChapterKey]: [] }));
    setChapterOrder((prev) => [...prev, newChapterKey]);
    setNewChapterTitle("");
    closeAllInputs();
  };

  const onUpdateLesson = (
    chapterKey: string,
    lessonId: number,
    fields: Partial<Lesson>,
  ) => {
    setListLesson((prevItems) => {
      const currentLessons = prevItems[chapterKey] || [];
      const updatedLessons = currentLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...fields } : lesson,
      );
      return { ...prevItems, [chapterKey]: updatedLessons };
    });
    closeAllInputs();
  };

  const onAddLesson = (chapterKey: string, lessonTitle: string) => {
    if (!lessonTitle.trim()) return;
    const newLessonId = Math.floor(Math.random() * 100000);
    const currentLessons = listLesson[chapterKey] || [];
    const newLesson: Lesson = {
      id: newLessonId,
      chapterId: chapterDetails[chapterKey]?.id || 0,
      title: lessonTitle.trim(),
      videoUrl: "",
      duration: 0,
      sortOrder: currentLessons.length,
      isPreview: false,
    };
    setListLesson((prev) => ({
      ...prev,
      [chapterKey]: [...currentLessons, newLesson],
    }));
    closeAllInputs();
  };

  return (
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
              onAddLesson={onAddLesson}
            >
              {lessons.map((lesson, lessonIndex) => (
                <LessonItem
                  key={lesson.id}
                  lessonId={lesson.id}
                  title={lesson.title}
                  index={lessonIndex}
                  chapterKey={chapterKey}
                  chapterIndex={chapterIndex}
                  onUpdateLesson={onUpdateLesson}
                  videoUrl={lesson.videoUrl}
                  duration={lesson.duration}
                  isPreview={lesson.isPreview}
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
              disabled={!newChapterTitle.trim()}
            >
              Add
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
  );
}
