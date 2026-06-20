import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseFormSkeleton() {
  return (
    <div className="mx-15 max-w-400 w-full animate-pulse">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="grid gap-6 lg:col-span-2">
            <Card className="bg-background border shadow-none">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-60 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border shadow-none">
              <CardHeader>
                <Skeleton className="h-5 w-36" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:col-span-1">
            <Card className="bg-background border shadow-none">
              <CardHeader>
                <Skeleton className="h-5 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full rounded-md" />
              </CardContent>
            </Card>

            <Card className="bg-background border shadow-none">
              <CardHeader>
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border shadow-none">
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
