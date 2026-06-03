// // import { useSortable } from "@dnd-kit/react/sortable";
// // import { CollisionPriority } from "@dnd-kit/abstract";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Pencil, GripVertical, Trash2, Plus } from "lucide-react";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // interface ColumnProps {
// //   children: React.ReactNode;
// //   id: string;
// //   index: number;
// //   title: string;
// //   lessonCount: number;
// // }
// // export function ChapterColumn({
// //   children,
// //   id,
// //   index,
// //   title,
// //   lessonCount,
// // }: ColumnProps) {
// //   const { ref } = useSortable({
// //     id,
// //     index,
// //     type: "column",
// //     collisionPriority: CollisionPriority.Low,
// //     accept: ["item", "column"],
// //     data: { chapterId: id },
// //   });

// //   return (
// //     <Card className="px-4 pb-6 pt-0 bg-background border shadow-none" ref={ref}>
// //       <CardContent className="p-0">
// //         <div className="flex items-center justify-between py-6">
// //           <div className="flex items-center gap-4">
// //             <div className="flex items-center gap-4">
// //               {" "}
// //               <GripVertical className="w-6 h-6 cursor-pointer" />
// //               <h4 className="text-lg font-bold">
// //                 Chapter {index + 1}: {title}
// //               </h4>
// //             </div>

// //             <Badge className="gap-1" variant="outline">
// //               <span>{lessonCount}</span>
// //               <span>lessons</span>
// //             </Badge>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <Button variant="outline" className="gap-2">
// //               <Pencil size={15} />
// //               Edit
// //             </Button>
// //             <Button variant="outline" className="gap-2">
// //               <Trash2 size={15} className="text-[#E9122B]" />
// //             </Button>
// //           </div>
// //         </div>

// //         <div className="flex flex-col gap-4">
// //           {" "}
// //           {children}
// //           <Button variant="outline" className="gap-2 w-full">
// //             <Plus size={15} />
// //             Add lesson
// //           </Button>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// import { useSortable } from "@dnd-kit/react/sortable";
// import { CollisionPriority } from "@dnd-kit/abstract";
// import { Card, CardContent } from "@/components/ui/card";
// import { Pencil, GripVertical, Trash2, Plus } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// interface ColumnProps {
//   children: React.ReactNode;
//   id: string;
//   index: number;
//   title: string;
//   lessonCount: number;
// }

// export function ChapterColumn({
//   children,
//   id,
//   index,
//   title,
//   lessonCount,
// }: ColumnProps) {
//   const { ref, isDragging } = useSortable({
//     id,
//     index,
//     type: "column",
//     collisionPriority: CollisionPriority.Low,
//     accept: ["item", "column"],
//     data: { chapterId: id },
//   });

//   return (
//     <Card
//       className={`px-4 pb-6 pt-0 bg-background border shadow-none transition-all ${
//         isDragging ? "opacity-40 border-dashed border-gray-400 bg-muted/30" : ""
//       }`}
//       ref={ref}
//     >
//       <CardContent className="p-0">
//         <div className="flex items-center justify-between py-6">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-4">
//               <GripVertical className="w-6 h-6 cursor-pointer" />
//               <h4 className="text-lg font-bold">
//                 Chapter {index + 1}: {title}
//               </h4>
//             </div>

//             <Badge className="gap-1" variant="outline">
//               <span>{lessonCount}</span>
//               <span>lessons</span>
//             </Badge>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="outline" className="gap-2">
//               <Pencil size={15} />
//               Edit
//             </Button>
//             <Button variant="outline" className="gap-2">
//               <Trash2 size={15} className="text-[#E9122B]" />
//             </Button>
//           </div>
//         </div>

//         <div className="flex flex-col gap-4">
//           {children}
//           <Button variant="outline" className="gap-2 w-full">
//             <Plus size={15} />
//             Add lesson
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, GripVertical, Trash2, Plus, Check, X } from "lucide-react"; // Giữ nguyên icon, thêm Check/X cho nút lưu nhanh
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Thêm Input của dự án

interface ColumnProps {
  children: React.ReactNode;
  id: string;
  index: number;
  title: string;
  lessonCount: number;
  onUpdateTitle?: (id: string, newTitle: string) => void;
}

export function ChapterColumn({
  children,
  id,
  index,
  title,
  lessonCount,
  onUpdateTitle,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { ref, isDragging } = useSortable({
    id,
    index,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "column"],
    data: { chapterId: id },
    disabled: isEditing,
  });

  // useEffect(() => {
  //   if (isEditing && inputRef.current) {
  //     inputRef.current.focus();
  //     inputRef.current.select();
  //   }
  // }, [isEditing]);

  // useEffect(() => {
  //   setEditTitle(title);
  // }, [title]);

  const handleSave = () => {
    if (editTitle.trim() === "") {
      setEditTitle(title);
      setIsEditing(false);
      return;
    }
    if (onUpdateTitle) {
      onUpdateTitle(id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditTitle(title);
      setIsEditing(false);
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
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold whitespace-nowrap">
                    Chapter {index + 1}:
                  </span>
                  <div className="w-100">
                    <Input
                      ref={inputRef}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-7 font-medium py-1 px-2 w-full"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={handleSave}
                    >
                      <Check size={15} />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditTitle(title);
                        setIsEditing(false);
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
            {!isEditing && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={15} />
                Edit
              </Button>
            )}
            <Button variant="outline" className="gap-2">
              <Trash2 size={15} className="text-[#E9122B]" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {children}
          <Button variant="outline" className="gap-2 w-full h-12">
            <Plus size={15} />
            Add lesson
          </Button>
        </div>
      </CardContent>
      <div className="flex items-center justify-between">
        <div className="div1"></div>
        <div className="div2"></div>
      </div>
    </Card>
  );
}
