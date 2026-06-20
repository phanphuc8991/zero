"use client";

import { useState } from "react";
import DataTable from "@/components/data-table/data-table";

import { Instructor } from "@/features/courses/contants";
import { AddInstructor } from "@/features/instructor/components/add-instructor";
import { EditInstructor } from "@/features/instructor/components/edit-instructor";
import { DeleteInstructor } from "@/features/instructor/components/delete-instructor";

interface InstructorWrapperProps {
  instructorsData: Instructor[];
  columns: any[];
}

export function InstructorWrapper({
  instructorsData,
  columns,
}: InstructorWrapperProps) {
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
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

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Instructors</h1>
        <div className="flex items-center gap-2">
          <AddInstructor />

          <EditInstructor
            isOpen={isEditOpen}
            instructor={selectedInstructor}
            onClose={() => {
              setIsEditOpen(false);
              setSelectedInstructor(null);
            }}
          />

          <DeleteInstructor
            isOpen={isDeleteOpen}
            instructor={selectedInstructor}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedInstructor(null);
            }}
          />
        </div>
      </div>

      <DataTable
        defaultPageSize={5}
        searchColumn="name"
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        data={instructorsData}
        isLoading={false}
      />
    </>
  );
}
