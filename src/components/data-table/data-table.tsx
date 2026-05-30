"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ColumnsIcon,
  Trash2,
  Download,
  Copy,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import FilterPopover from "@/components/filter-popover";
import SearchInput from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterConfig {
  columnId: string;
  title: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultPageSize?: number;
  searchColumn?: string;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  isLoading?: boolean;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  defaultPageSize = 5,
  searchColumn = "title",
  filters = [],
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [facetFilters, setFacetFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
  });

  const handleFilterChange = (columnId: string, value: string) => {
    setFacetFilters((prev) => {
      const currentValues = prev[columnId] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      const updatedFilters = { ...prev, [columnId]: nextValues };
      table
        .getColumn(columnId)
        ?.setFilterValue(nextValues.length ? nextValues : undefined);

      return updatedFilters;
    });
  };

  const skeletonRowCount = defaultPageSize;
  console.log(
    "table.getRowModel().rows?.length ",
    table.getRowModel().rows?.length,
  );
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize: defaultPageSize }));
  }, [defaultPageSize]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {table.getColumn(searchColumn) && (
            <SearchInput
              value={
                (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                ""
              }
              onChange={(value) =>
                table.getColumn(searchColumn)?.setFilterValue(value)
              }
            />
          )}

          <div className="flex items-center gap-3">
            {filters.map((filter) => (
              <FilterPopover
                key={filter.columnId}
                title={filter.title}
                options={filter.options}
                selectedValues={facetFilters[filter.columnId] || []}
                onChange={(value) => handleFilterChange(filter.columnId, value)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="ml-auto flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    Selected ({table.getFilteredSelectedRowModel().rows.length})
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Copy size={14} className="mr-2" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText size={14} className="mr-2" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download size={14} className="mr-2" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 size={14} className="mr-2" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" title="Toggle Columns">
                <ColumnsIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnTitle =
                    (column.columnDef.meta as string) || column.id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnTitle}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full flex flex-col">
        <div className="overflow-hidden rounded-md border">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.column.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                  {}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`}>
                    {columns.map((_, colIndex) => (
                      <TableCell
                        key={`skeleton-col-${colIndex}`}
                        className="py-2"
                      >
                        <Skeleton className="h-8.25 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-2"
                          style={{ width: cell.column.getSize() }}
                        >
                          <div className="truncate">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {table.getRowModel().rows.length < pagination.pageSize &&
                    Array.from({
                      length:
                        pagination.pageSize - table.getRowModel().rows.length,
                    }).map((_, index) => (
                      <TableRow
                        key={`empty-row-${index}`}
                        className="hover:bg-transparent border-transparent select-none pointer-events-none"
                      >
                        {table
                          .getVisibleFlatColumns()
                          .map((column, colIndex) => (
                            <TableCell
                              key={`empty-col-${colIndex}`}
                              className="py-2"
                              style={{ width: column.getSize() }}
                            >
                              <div className="h-8.25 invisible">&nbsp;</div>
                            </TableCell>
                          ))}
                      </TableRow>
                    ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-muted-foreground"
                    style={{ height: `${skeletonRowCount * 64}px` }}
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 mt-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={isLoading || !table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={isLoading || !table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
