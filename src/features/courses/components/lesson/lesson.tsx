"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCourseStore } from "@/stores/useCourseStore";
import { useSortable } from "@dnd-kit/react/sortable";
import { Pencil, GripVertical, Play, Trash2, X, Loader2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  videoUrl: string | null;
  minutes: string;
  seconds: string;
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
  videoUrl: string | null | undefined;
  minutes: string;
  seconds: string;
  isPreview: boolean;
  sortOrder: number;
  isPending: boolean;
  onDeleteLesson?: (chapterKey: string, lessonId: number) => void;
}

export function LessonItem({
  lessonId,
  chapterId,
  title,
  index,
  chapterKey,
  chapterIndex,
  videoUrl,
  minutes,
  seconds,
  isPreview,
  sortOrder,
  isPending,
  onDeleteLesson,
}: LessonProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false);
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

  function formatDuration(minutes: string, seconds: string): string {
    const mins = parseInt(String(minutes), 10) || 0;
    const secs = parseInt(String(seconds), 10) || 0;

    const totalSeconds = mins * 60 + secs;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const hoursStr = String(h).padStart(2, "0");
    const minutesStr = String(m).padStart(2, "0");
    const secondsStr = String(s).padStart(2, "0");

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  const openEditLesson = () => {
    const lessson = {
      title,
      id: lessonId,
      chapterId,
      videoUrl,
      minutes,
      seconds,
      isPreview,
      sortOrder,
    };
    openEditLessonDrawer(chapterId, chapterKey, lessson);
  };

  const handdleDeleteLesson = () => {
    if (onDeleteLesson) {
      onDeleteLesson(chapterKey, lessonId);
    }
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
            <button
              onClick={() => {
                setShowVideo(true);
              }}
              disabled={!videoUrl}
              className={`p-2 rounded-full transition-all duration-200 
    ${
      !videoUrl
        ? "opacity-30 cursor-not-allowed text-muted-foreground"
        : "cursor-pointer hover:bg-secondary text-muted-foreground hover:text-foreground active:scale-95"
    }`}
            >
              <Play className="w-5 h-5" />
            </button>
            {showVideo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
                <div className="relative w-full max-w-3xl bg-background rounded-lg p-6 shadow-lg border animate-in fade-in-50 duration-200">
                  <button
                    onClick={() => setShowVideo(false)}
                    className="cursor-pointer absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1 text-sm mb-2">
                    <h4 className="font-semibold">
                      <span>{chapterIndex + 1}.</span>
                      <span>{index + 1}:</span>
                    </h4>
                    <span> {title}</span>
                  </div>

                  <div className="aspect-video w-full rounded-md overflow-hidden">
                    <video
                      src={videoUrl as string}
                      controls={true}
                      preload="metadata"
                      autoPlay={false}
                      muted={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-sm">
                <h4 className="font-semibold">
                  <span>{chapterIndex + 1}.</span>
                  <span>{index + 1}:</span>
                </h4>
                <span> {title}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground font-normal">
                  {formatDuration(minutes, seconds)}
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
              onClick={() => {
                setShowDialogConfirmDelete(true);
              }}
            >
              <Trash2 size={15} className="text-[#E9122B]" />
            </Button>
          </div>
        </div>
      </CardContent>
      <AlertDialog
        open={showDialogConfirmDelete}
        onOpenChange={setShowDialogConfirmDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-normal">
              Delete Item
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              disabled={isPending}
              variant="outline"
              onClick={() => setShowDialogConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                handdleDeleteLesson();
              }}
            >
              {isPending && <Loader2 className="animate-spin" size={15} />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
