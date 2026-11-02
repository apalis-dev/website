import { ArrowUpDownIcon, PlusIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface AppsPageSkeletonProps {
  workspaceName: string;
}

export function AppsPageSkeleton({ workspaceName }: AppsPageSkeletonProps) {
  return (
    <div
      className="mx-auto max-w-7xl space-y-8"
      aria-busy="true"
      aria-label={`Loading apps in ${workspaceName}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Apps</h1>

          <p className="text-sm text-muted-foreground">
            Manage applications in {workspaceName}.
          </p>
        </div>

        <Button disabled>
          <PlusIcon className="size-4" />
          New App
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search applications..." className="pl-9" disabled />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-[140px] rounded-lg" />

          <Button variant="outline" disabled>
            <ArrowUpDownIcon className="size-4" />
            Sort
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="rounded-xl border shadow-none">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-8 shrink-0 rounded-md" />
                    <Skeleton className="h-4 w-40" />
                  </div>

                  <Skeleton className="mt-3 h-3.5 w-3/4" />
                </div>

                <Skeleton className="ml-4 size-4 shrink-0 rounded-sm" />
              </div>

              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-12" />
                </div>

                <Skeleton className="h-3 w-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
