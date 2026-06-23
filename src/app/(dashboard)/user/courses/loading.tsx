"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataTableLoading() {
  const skeletonRows = Array.from({ length: 5 });
  const skeletonCols = Array.from({ length: 4 });

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-62.5 rounded-md" />
          <Skeleton className="h-10 w-25 rounded-md" />
          <Skeleton className="h-10 w-25 rounded-md" />
        </div>
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      <div className="w-full flex flex-col">
        <div className="overflow-hidden rounded-md border">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                {skeletonCols.map((_, index) => (
                  <TableHead key={`head-${index}`}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonRows.map((_, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  {skeletonCols.map((_, colIndex) => (
                    <TableCell key={`col-${colIndex}`} className="py-2">
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 mt-4">
          <div className="flex-1">
            <Skeleton className="h-4 w-37.5" />
          </div>
          <div className="space-x-2">
            <Skeleton className="h-9 w-17.5 rounded-md" />
            <Skeleton className="h-9 w-12.5 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
