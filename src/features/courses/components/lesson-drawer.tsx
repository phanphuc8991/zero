"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LessonForm } from "@/features/courses/components/lesson-form";
import { useCourseStore } from "@/stores/useCourseStore";
import { useShallow } from "zustand/react/shallow";

interface LessonDrawerProps {
  onSaveLesson: (
    mode: "CREATE" | "EDIT",
    context: { chapterId: number | null; lessonId: number | null },
    formData: any,
  ) => void;
}

export function LessonDrawer({ onSaveLesson }: LessonDrawerProps) {
  const {
    isLessonDrawerOpen,
    lessonDrawerMode,
    activeChapterIndex,
    activeChapterId,
    editingLessonData,
    closeLessonDrawer,
  } = useCourseStore(
    useShallow((state) => ({
      isLessonDrawerOpen: state.isLessonDrawerOpen,
      lessonDrawerMode: state.lessonDrawerMode,
      activeChapterIndex: state.activeChapterIndex,
      activeChapterId: state.activeChapterId,
      editingLessonData: state.editingLessonData,
      closeLessonDrawer: state.closeLessonDrawer,
    })),
  );

  const handleFormSubmit = (formData: any) => {
    if (lessonDrawerMode) {
      onSaveLesson(
        lessonDrawerMode,
        {
          chapterId: activeChapterId,
          lessonId: editingLessonData?.id || null,
        },
        formData,
      );
      closeLessonDrawer();
    }
  };

  return (
    <Sheet
      open={isLessonDrawerOpen}
      onOpenChange={(open) => !open && closeLessonDrawer()}
    >
      <SheetContent
        side="right"
        className="w-full flex flex-col gap-6 h-full"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <SheetHeader className="">
          <SheetTitle className="text-xl font-bold">
            {lessonDrawerMode === "CREATE"
              ? `Add Lesson (Ch. ${(activeChapterIndex ?? 0) + 1})`
              : "Edit Lesson"}
          </SheetTitle>
          <SheetDescription>
            {lessonDrawerMode === "CREATE"
              ? "Enter lesson details below."
              : `Modifying: "${editingLessonData?.title}"`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 min-h-0 px-4">
          <LessonForm onSubmitSuccess={handleFormSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
