"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Category } from "@/features/courses/contants";

export const categoryColumns: ColumnDef<Category>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    meta: "Category Name",
    size: 150,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent cursor-pointer font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "slug",
    size: 250,
    meta: "Slug URL",
    header: "Slug URL",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {row.getValue("slug")}
      </div>
    ),
  },
  {
    size: 250,
    accessorKey: "description",
    meta: "Description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string | null | undefined;
      return (
        <div
          className="max-w-75 truncate text-muted-foreground"
          title={desc || ""}
        >
          {desc || "—"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as
        | {
            handleEdit?: (category: Category) => void;
            handleDelete?: (category: Category) => void;
          }
        | undefined;
      return (
        <div className="flex items-center justify-end gap-2 text-end">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (meta?.handleEdit) {
                meta.handleEdit(row.original);
              }
            }}
          >
            <span className="sr-only">Edit</span>
            <Edit />
          </Button>
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
            onClick={() => {
              if (meta?.handleDelete) {
                meta.handleDelete(row.original);
              }
            }}
          >
            <span className="sr-only">Delete</span>
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
