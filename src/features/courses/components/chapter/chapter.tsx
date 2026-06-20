import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pencil,
  GripVertical,
  Trash2,
  Plus,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourseStore } from "@/stores/useCourseStore";
import { useShallow } from "zustand/react/shallow";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChapterProps {
  children: React.ReactNode;
  chapterKey: string;
  index: number;
  title: string;
  lessonCount: number;
  chapterId: number;
  onUpdateChapter?: (chapterKey: string, newTitle: string) => void;
  onAddLesson?: (chapterKey: string, lessonTitle: string) => void;
  onDeleteChapter?: (chapterKey: string) => void;
  isPending: boolean;
}

export function ChapterColumn({
  children,
  chapterKey,
  index,
  title,
  lessonCount,
  onUpdateChapter,
  onDeleteChapter,
  chapterId,
  isPending,
}: ChapterProps) {
  const {
    isSystemLocked,
    editingChapterId,
    openEditChapter,
    closeAllInputs,
    openAddLessonDrawer,
  } = useCourseStore(
    useShallow((state) => ({
      isSystemLocked: state.isSystemLocked(),
      editingChapterId: state.editingChapterId,
      openEditChapter: state.openEditChapter,
      closeAllInputs: state.closeAllInputs,
      openAddLessonDrawer: state.openAddLessonDrawer,
    })),
  );

  const isEditingThisChapter = editingChapterId === chapterId;
  const [chapterTitle, setChapterTitle] = useState(title);
  const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { ref, isDragging } = useSortable({
    id: chapterKey,
    index,
    type: "column",
    disabled: isEditingThisChapter,
  });

  const handleAddChapter = () => {
    if (onUpdateChapter) {
      onUpdateChapter(chapterKey, chapterTitle.trim());
    }
  };

  const handdleDeleteChapter = () => {
    if (onDeleteChapter) {
      onDeleteChapter(chapterKey);
    }
  };

  useEffect(() => {
    if (isEditingThisChapter && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingThisChapter]);

  return (
    <Card
      className={`px-4 pt-0 py-0 bg-background border shadow-none transition-all ${
        isDragging ? "opacity-40 border-dashed border-gray-400 bg-muted/30" : ""
      }`}
      ref={ref}
    >
      <CardContent className="p-0">
        <div className="flex items-center py-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-4">
              <GripVertical className="w-6 h-6 cursor-pointer" />
              {isEditingThisChapter ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold whitespace-nowrap">
                    Chapter {index + 1}:
                  </span>
                  <div className="w-100">
                    <Input
                      ref={inputRef}
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
                      className="h-7 font-medium py-1 px-2 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      disabled={!chapterTitle.trim() || isPending}
                      onClick={handleAddChapter}
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" size={15} />
                      ) : (
                        <Check size={15} />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setChapterTitle(title);
                        closeAllInputs();
                      }}
                    >
                      <X size={15} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              ) : (
                <h4 className="text-lg font-bold">
                  Chapter {index + 1}: {title}
                </h4>
              )}
            </div>

            <Badge className="gap-1" variant="outline">
              <span>{lessonCount}</span>
              <span>lessons</span>
            </Badge>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {!isEditingThisChapter && (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => openEditChapter(chapterId)}
                  disabled={isSystemLocked || isPending}
                >
                  <Pencil size={15} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isSystemLocked}
                  onClick={() => {
                    setShowDialogConfirmDelete(true);
                  }}
                >
                  <Trash2 size={15} className="text-[#E9122B]" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {children}
          <Button
            variant="outline"
            className="gap-2 w-full h-12 cursor-pointer text-sm mb-6"
            onClick={() => openAddLessonDrawer(chapterId, index, chapterKey)}
            disabled={isSystemLocked}
          >
            <Plus size={15} />
            Add lesson
          </Button>
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
                handdleDeleteChapter();
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
