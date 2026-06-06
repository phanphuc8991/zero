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
  durationSeconds: number;
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
  const [items, setItems] = useState<{ [key: string]: Lesson[] }>({});
  const [chapterDetails, setChapterDetails] = useState<{
    [key: string]: ChapterInfo;
  }>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const handleUpdateChapterTitle = (columnKey: string, newTitle: string) => {
    setChapterDetails((prev) => ({
      ...prev,
      [columnKey]: { ...prev[columnKey], title: newTitle },
    }));
    closeAllInputs();
  };

  const handleUpdateLessonFields = (
    columnKey: string,
    lessonId: number,
    fieldsToUpdate: Partial<Lesson>,
  ) => {
    setItems((prevItems) => {
      const currentLessons = prevItems[columnKey] || [];
      const updatedLessons = currentLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...fieldsToUpdate } : lesson,
      );
      return { ...prevItems, [columnKey]: updatedLessons };
    });
    closeAllInputs();
  };

  const handleAddChapter = () => {
    const newColumnKey = `chapter-key-${Date.now()}`;
    const newChapterId = Math.floor(Math.random() * 10000);
    setChapterDetails((prev) => ({
      ...prev,
      [newColumnKey]: {
        id: newChapterId,
        title: newChapterTitle.trim(),
        sortOrder: Object.keys(prev).length,
      },
    }));
    setItems((prev) => ({ ...prev, [newColumnKey]: [] }));
    setColumnOrder((prev) => [...prev, newColumnKey]);
    setNewChapterTitle("");
    closeAllInputs();
  };

  const handleAddLesson = (columnKey: string, lessonTitle: string) => {
    if (!lessonTitle.trim()) return;
    const newLessonId = Math.floor(Math.random() * 100000);
    const currentLessons = items[columnKey] || [];
    const newLesson: Lesson = {
      id: newLessonId,
      chapterId: chapterDetails[columnKey]?.id || 0,
      title: lessonTitle.trim(),
      videoUrl: "",
      durationSeconds: 0,
      sortOrder: currentLessons.length,
      isPreview: false,
    };
    setItems((prev) => ({
      ...prev,
      [columnKey]: [...currentLessons, newLesson],
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
          const sourceChapterKey = Object.keys(items).find((key) =>
            items[key].some((lesson) => lesson.id === source.id),
          );
          const targetChapterKey = Object.keys(items).find((key) =>
            items[key].some((lesson) => lesson.id === target.id),
          );
          if (sourceChapterKey !== targetChapterKey) return;
        }
        setItems((prevItems) => move(prevItems, event));
      }}
      onDragEnd={(event) => {
        const { source } = event.operation;
        if (event.canceled || source?.type !== "column") return;
        setColumnOrder((columns) => move(columns, event));
      }}
    >
      <div className="flex flex-col gap-4 pt-4">
        {columnOrder.length === 0 && (
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

        {columnOrder.map((columnKey, chapterIndex) => {
          const chapter = chapterDetails[columnKey];
          const lessons = items[columnKey] || [];
          return (
            <ChapterColumn
              key={columnKey}
              id={columnKey}
              index={chapterIndex}
              title={chapter.title}
              chapterId={chapter.id}
              lessonCount={lessons.length}
              onUpdateTitle={handleUpdateChapterTitle}
              onAddLesson={handleAddLesson}
            >
              {lessons.map((lesson, lessonIndex) => (
                <LessonItem
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  index={lessonIndex}
                  column={columnKey}
                  chapterIndex={chapterIndex}
                  onUpdateLesson={handleUpdateLessonFields}
                  videoUrl={lesson.videoUrl}
                  durationSeconds={lesson.durationSeconds}
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
              onClick={handleAddChapter}
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
