"use client";

import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import DataTable from "@/components/data-table/data-table";
import { getInstructorsAction } from "@/features/courses/actions";
import { instructorColumns } from "@/components/data-table/instructor-columns";
import { AddInstructor } from "@/features/courses/components/instructor/add-instructor";
import { EditInstructor } from "@/features/courses/components/instructor/edit-instructor";
import { DeleteInstructor } from "@/features/courses/components/instructor/delete-instructor";
import { Instructor } from "@/features/courses/contants";
import { useCourseStore } from "@/stores/useCourseStore";

export default function Instructors() {
  const [instructorsData, setInstructorsData] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsEditOpen(true);
  };

  const handleDelete = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsDeleteOpen(true);
  };

  const { execute: fetchInstructors } = useAction(getInstructorsAction, {
    onSuccess: ({ data }) => {
      setIsInitialLoading(false);
      if (data?.instructors) {
        setInstructorsData(data.instructors);
      }
    },
    onError: ({ error }) => {
      setIsInitialLoading(false);
      console.error("Failed to load instructors:", error);
      toast.error("Failed to load instructors");
    },
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleRefreshData = () => {
    setIsInitialLoading(true);
    fetchInstructors();
    useCourseStore.getState().resetInstructors();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Instructors</h1>
        <div>
          <AddInstructor onSuccess={handleRefreshData} />

          <EditInstructor
            isOpen={isEditOpen}
            instructor={selectedInstructor}
            onClose={() => setIsEditOpen(false)}
            onSuccess={handleRefreshData}
          />

          <DeleteInstructor
            isOpen={isDeleteOpen}
            instructor={selectedInstructor}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedInstructor(null);
            }}
            onSuccess={handleRefreshData}
          />
        </div>
      </div>

      <DataTable
        defaultPageSize={5}
        searchColumn="name"
        columns={instructorColumns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        data={instructorsData}
        isLoading={isInitialLoading}
      />
    </div>
  );
}
