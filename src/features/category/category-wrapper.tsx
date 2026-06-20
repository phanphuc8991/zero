"use client";

import { useState } from "react";
import DataTable from "@/components/data-table/data-table";
import { AddCategory } from "./components/add-category";
import { EditCategory } from "./components/edit-category";
import { DeleteCategory } from "./components/delete-category";
import { Category } from "@/features/courses/contants";

interface CategoryWrapperProps {
  categoriesData: Category[];
  categoriesFilters: any[];
  columns: any[];
}

export function CategoryWrapper({
  categoriesData,
  categoriesFilters,
  columns,
}: CategoryWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Categories</h1>
        <div className="flex items-center gap-2">
          <AddCategory />

          <EditCategory
            isOpen={isEditOpen}
            category={selectedCategory}
            onClose={() => {
              setIsEditOpen(false);
              setSelectedCategory(null);
            }}
          />

          <DeleteCategory
            isOpen={isDeleteOpen}
            category={selectedCategory}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedCategory(null);
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
        data={categoriesData}
        filters={categoriesFilters}
        isLoading={false}
      />
    </>
  );
}
