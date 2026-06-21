"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LessonForm } from "@/features/courses/components/lesson/lesson-form";
import { LessonFormType, LessonType } from "@/features/courses/contants-1";
import { useCourseStore } from "@/stores/useCourseStore";
import { useShallow } from "zustand/react/shallow";

interface LessonDrawerProps {
  onAddLesson: (formData: LessonFormType) => void;
  onUpdateLesson: (formData: LessonFormType) => void;
  isPending: boolean;
}

export function LessonDrawer({
  onAddLesson,
  onUpdateLesson,
  isPending,
}: LessonDrawerProps) {
  const { lessonDrawerMode, activeChapterId, closeLessonDrawer } =
    useCourseStore(
      useShallow((state) => ({
        lessonDrawerMode: state.lessonDrawerMode,
        activeChapterId: state.activeChapterId,
        closeLessonDrawer: state.closeLessonDrawer,
      })),
    );

  const handleFormSubmit = (data: LessonFormType) => {
    if (lessonDrawerMode === "CREATE") {
      onAddLesson(data);
    } else {
      onUpdateLesson(data);
    }
  };

  return (
    <Sheet
      open={!!activeChapterId}
      onOpenChange={(open) => !open && closeLessonDrawer()}
    >
      <SheetContent
        side="right"
        className="w-full flex flex-col gap-6 h-full"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="">
          <SheetTitle className="text-xl font-bold">
            {lessonDrawerMode === "CREATE" ? "Add Lesson" : "Edit Lesson"}
          </SheetTitle>
          <SheetDescription className="sr-only"></SheetDescription>
        </SheetHeader>

        <div className="flex-1 min-h-0 px-4">
          <LessonForm
            isPending={isPending}
            handleFormSubmit={handleFormSubmit}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
