"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import DataTable from "@/components/data-table/data-table";
import { getCategoriesAction } from "@/features/courses/actions";
import { categoryColumns } from "@/components/data-table/category-columns";
import { AddCategory } from "@/features/courses/components/category/add-category";
import { Category } from "@/features/courses/contants";
import { EditCategory } from "@/features/courses/components/category/edit-category";
import { DeleteCategory } from "@/features/courses/components/category/delete-category";

const categoriesFilters = [
  {
    columnId: "slug",
    title: "Categories",
    options: [
      { value: "ai-prompt-engineering", label: "Artificial Intelligence (AI)" },
      { value: "no-code-development", label: "No-Code / Operations" },
      { value: "ui-ux-design", label: "UI/UX Design" },
      {
        value: "data-analytics-automation",
        label: "Data Analytics & Automation",
      },
    ],
  },
];

export default function Categories() {
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
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

  const { execute: fetchCategories } = useAction(getCategoriesAction, {
    onSuccess: ({ data }) => {
      setIsInitialLoading(false);
      if (data?.categories) {
        setCategoriesData(data.categories);
      }
    },
    onError: ({ error }) => {
      setIsInitialLoading(false);
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefreshData = () => {
    setIsInitialLoading(true);
    fetchCategories();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Categories</h1>
        <div>
          <AddCategory onSuccess={handleRefreshData} />

          <EditCategory
            isOpen={isEditOpen}
            category={selectedCategory}
            onClose={() => setIsEditOpen(false)}
            onSuccess={handleRefreshData}
          />

          <DeleteCategory
            isOpen={isDeleteOpen}
            category={selectedCategory}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedCategory(null);
            }}
            onSuccess={handleRefreshData}
          />
        </div>
      </div>

      <DataTable
        defaultPageSize={5}
        searchColumn="name"
        columns={categoryColumns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        data={categoriesData}
        filters={categoriesFilters}
        isLoading={isInitialLoading}
      />
    </div>
  );
}
