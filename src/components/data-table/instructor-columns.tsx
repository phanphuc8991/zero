"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Instructor } from "@/features/courses/contants";

export const instructorColumns: ColumnDef<Instructor>[] = [
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
    meta: "Instructor Name",
    size: 200,
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-4 hover:bg-transparent cursor-pointer font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Instructor Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const avatarUrl = row.original.avatarUrl;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={avatarUrl ?? undefined} alt={name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    meta: "Title",
    size: 200,
    header: "Title",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "bio",
    meta: "Bio",
    size: 300,
    header: "Bio",
    cell: ({ row }) => {
      const bio = row.getValue("bio") as string | null | undefined;
      return (
        <div
          className="max-w-75 truncate text-muted-foreground"
          title={bio || ""}
        >
          {bio || "—"}
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
            handleEdit?: (instructor: Instructor) => void;
            handleDelete?: (instructor: Instructor) => void;
          }
        | undefined;
      return (
        <div className="flex items-center justify-end gap-2 text-end">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => meta?.handleEdit?.(row.original)}
          >
            <span className="sr-only">Edit</span>
            <Edit />
          </Button>
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
            onClick={() => meta?.handleDelete?.(row.original)}
          >
            <span className="sr-only">Delete</span>
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
