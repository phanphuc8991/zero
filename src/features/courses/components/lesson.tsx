"use client";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCourseStore } from "@/stores/useCourseStore";
import { useSortable } from "@dnd-kit/react/sortable";
import { Pencil, GripVertical, Play, Trash2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  videoUrl: string | null;
  duration: number;
  sortOrder: number;
  isPreview: boolean;
  chapterKey: string;
}

interface LessonProps {
  lessonId: number;
  title: string;
  index: number;
  chapterId: number;
  chapterKey: string;
  chapterIndex: number;
  videoUrl: string | null;
  duration: number;
  isPreview: boolean;
  onUpdateLesson?: (
    columnKey: string,
    lessonId: number,
    fields: Partial<Lesson>,
  ) => void;
}

export function LessonItem({
  lessonId,
  title,
  index,
  chapterId,
  chapterKey,
  chapterIndex,
  videoUrl,
  duration,
  isPreview,
}: LessonProps) {
  const { isSystemLocked, openEditLessonDrawer } = useCourseStore(
    useShallow((state) => ({
      isSystemLocked: state.isSystemLocked(),
      closeAllInputs: state.closeAllInputs,
      openEditLessonDrawer: state.openEditLessonDrawer,
    })),
  );
  const { ref, isDragging } = useSortable({
    id: lessonId,
    index,
    type: "item",
  });
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const openEditLesson = () => {
    const lessson = {
      id: lessonId,
      chapterId,
      title,
      videoUrl,
      duration,
      isPreview,
    };
    openEditLessonDrawer(chapterKey, lessson);
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 
       ${isDragging ? "opacity-40 border-dashed border-gray-400" : ""}`}
      ref={ref}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <GripVertical className="w-6 h-6 cursor-pointer text-muted-foreground" />
            <Play className="w-5 h-5 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <h4 className="font-semibold">
                  <span>{chapterIndex + 1}.</span>
                  <span>{index + 1}:</span>
                </h4>
                <span className=""> {title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className=" text-muted-foreground font-normal">
                  {duration > 0 ? formatDuration(duration) : "0:00"}
                </span>
                <Badge className="gap-1 bg-[#EAF3DF] text-[#3D6C1A] text-[10px] px-1.5 py-0 h-4 shadow-none border-none hover:bg-[#EAF3DF]">
                  <span>video</span>
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              type="button"
              onClick={openEditLesson}
              disabled={isSystemLocked}
            >
              <Pencil size={15} />
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              type="button"
              disabled={isSystemLocked}
            >
              <Trash2 size={15} className="text-[#E9122B]" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
