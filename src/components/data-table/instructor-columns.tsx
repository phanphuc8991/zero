"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type InstructorDataRow = {
  id: number;
  name: string;
  title: string;
  avatarUrl: string | null;
  bio: string | null;
};

export const instructorColumns: ColumnDef<InstructorDataRow>[] = [
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
    accessorKey: "avatarUrl",
    meta: "Avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const avatarUrl = row.getValue("avatarUrl") as string;
      const name = row.getValue("name") as string;

      return (
        <div className="flex items-center">
          <img
            src={
              avatarUrl ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={name}
            className="h-9 w-9 rounded-full object-cover border shadow-sm bg-muted"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />
        </div>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "name",
    meta: "Instructor Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 hover:bg-transparent cursor-pointer font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Instructor Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-semibold text-foreground">
        {row.getValue("name")}
      </div>
    ),
  },

  {
    accessorKey: "title",
    meta: "Professional Title",
    header: "Professional Title",
    cell: ({ row }) => {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          {row.getValue("title")}
        </span>
      );
    },
  },

  {
    accessorKey: "bio",
    meta: "Biography",
    header: "Biography",
    cell: ({ row }) => {
      const bio = row.getValue("bio") as string;
      return (
        <div
          className="max-w-70 truncate text-muted-foreground text-xs"
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
    cell: ({ row }) => {
      const instructor = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => navigator.clipboard.writeText(instructor.name)}
            >
              <Copy size={14} /> Copy Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Edit size={14} /> Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive gap-2">
              <Trash2 size={14} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
