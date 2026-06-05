import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, GripVertical, Trash2, Plus, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourseStore } from "@/stores/useCourseStore";
import { useShallow } from "zustand/react/shallow";
interface ColumnProps {
  children: React.ReactNode;
  id: string;
  index: number;
  title: string;
  lessonCount: number;
  chapterId: number;
  onUpdateTitle?: (id: string, newTitle: string) => void;
  onAddLesson?: (columnKey: string, lessonTitle: string) => void;
}

export function ChapterColumn({
  children,
  id,
  index,
  title,
  lessonCount,
  onUpdateTitle,
  onAddLesson,
  chapterId,
}: ColumnProps) {
  const {
    isSystemLocked,
    editingChapterId,
    openEditChapter,
    openAddLesson,
    closeAllInputs,
    isAddingLessonChapterId,
  } = useCourseStore(
    useShallow((state) => ({
      isSystemLocked: state.isSystemLocked(),
      editingChapterId: state.editingChapterId,
      openEditChapter: state.openEditChapter,
      openAddLesson: state.openAddLesson,
      closeAllInputs: state.closeAllInputs,
      isAddingLessonChapterId: state.isAddingLessonChapterId,
    })),
  );

  const isEditingThisChapter = editingChapterId === chapterId;
  const isAddingThisLessonChapterId = isAddingLessonChapterId === chapterId;

  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: "column",
    data: { chapterId: id },
    disabled: isEditingThisChapter,
  });

  const [newLessonTitle, setNewLessonTitle] = useState("");

  const handleSaveLesson = () => {
    if (onAddLesson) {
      onAddLesson(id, newLessonTitle.trim());
    }
    setNewLessonTitle("");
  };

  useEffect(() => {
    if (isEditingThisChapter && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingThisChapter]);

  const handleSaveChapter = () => {
    if (onUpdateTitle) {
      onUpdateTitle(id, editTitle.trim());
    }
  };

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
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-7 font-medium py-1 px-2 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      disabled={!editTitle.trim()}
                      onClick={handleSaveChapter}
                    >
                      <Check size={15} />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditTitle(title);
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
                  disabled={isSystemLocked}
                >
                  <Pencil size={15} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isSystemLocked}
                >
                  <Trash2 size={15} className="text-[#E9122B]" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {children}
          {isAddingThisLessonChapterId ? (
            <div className="flex flex-col gap-2 p-3 border border-dashed rounded-lg bg-muted/20 mb-6">
              <Input
                autoFocus
                placeholder="Enter a new lesson title... (Press Enter to create)"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                className="h-9"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={() => {
                    closeAllInputs();
                    setNewLessonTitle("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8"
                  onClick={handleSaveLesson}
                  disabled={!newLessonTitle.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="gap-2 w-full h-12 cursor-pointer text-sm mb-6"
              onClick={() => openAddLesson(chapterId)}
              disabled={isSystemLocked}
            >
              <Plus size={15} />
              Add lesson
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
