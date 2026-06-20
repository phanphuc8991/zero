import { Skeleton } from "@/components/ui/skeleton";

export function CourseFormSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      =
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-5">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md self-start md:self-center" />
      </div>
      <div className="flex gap-4 border-b pb-2">
        <Skeleton className="h-8 w-28 rounded-sm" />
        <Skeleton className="h-8 w-36 rounded-sm" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl p-6 space-y-4 bg-card/50">
            <Skeleton className="h-5 w-40 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </div>

          <div className="border rounded-xl p-6 space-y-4 bg-card/50">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl p-6 space-y-4 bg-card/50">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="border rounded-xl p-6 space-y-4 bg-card/50">
            <Skeleton className="h-5 w-28" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
