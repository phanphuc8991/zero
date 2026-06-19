"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Copy, Eye, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { CourseTable } from "@/features/courses/contants-1";

export const courseColumns: ColumnDef<CourseTable>[] = [
  {
    id: "select",
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
    accessorKey: "title",
    meta: "Course Title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 font-semibold"
      >
        Course Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const courseId = row.original.id;
      return (
        <Link
          href={`/admin/courses/${courseId}/edit`}
          className="font-medium max-w-62.5 truncate"
          title={row.getValue("title")}
        >
          {row.getValue("title")}
        </Link>
      );
    },
  },
  {
    accessorKey: "instructorName",
    meta: "Instructor",
    header: () => <div className="text-start">Instructor</div>,
    cell: ({ row }) => (
      <div className="text-start" title={row.getValue("instructorName")}>
        {row.getValue("instructorName")}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-center">Duration</div>,
    meta: "Duration",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("duration")} hrs</div>
    ),
  },
  {
    accessorKey: "level",
    header: () => <div className="text-start">Level</div>,
    meta: "Level",
    cell: ({ row }) => (
      <div className="flex justify-start">
        <span className="flex px-2 py-1 text-xs font-semibold rounded bg-secondary text-secondary-foreground">
          {row.getValue("level")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    meta: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            isPublished
              ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
              : "bg-yellow-50 text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-500"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const course = row.original;

      return (
        <div className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(course.id.toString())
                }
              >
                <Copy size={14} className="mr-2" /> Copy Course ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye size={14} className="mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit2 size={14} className="mr-2" /> Edit Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
