import DataTable from "@/components/data-table/data-table";
import { categoryColumns } from "@/components/data-table/category-columns";
import { getCategories } from "@/features/category/action";
import { CategoryWrapper } from "@/features/category/category-wrapper";

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

export default async function CategoriesPage() {
  const categoriesData = await getCategories();

  return (
    <div className="flex flex-col gap-6 h-full">
      <CategoryWrapper
        categoriesData={categoriesData}
        categoriesFilters={categoriesFilters}
        columns={categoryColumns}
      />
    </div>
  );
}
