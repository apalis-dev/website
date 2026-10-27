import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

import type { DashboardApp } from "@/lib/dashboard/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  DashboardApp["status"],
  { dot: string; label: string }
> = {
  active: {
    dot: "bg-emerald-500",
    label: "Active",
  },
  inactive: {
    dot: "bg-muted-foreground",
    label: "Inactive",
  },
  pending: {
    dot: "bg-amber-500",
    label: "Pending",
  },
};

const planVariant: Record<DashboardApp["plan"], "default" | "secondary"> = {
  Free: "secondary",
  Pro: "default",
  Enterprise: "default",
};

interface AppCardProps {
  app: DashboardApp;
}

export function AppCard({ app }: AppCardProps) {
  const status = statusConfig[app.status];

  return (
    <Link href={`/dashboard/apps/${app.id}`} className="block group">
      <Card className="rounded-xl border shadow-none transition-[background-color,transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:bg-muted/30 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md border bg-background font-mono text-xs font-medium",
                    app.color
                  )}
                >
                  {app.icon}
                </div>

                <h3 className="truncate text-sm font-medium">{app.name}</h3>
              </div>

              {app.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {app.description}
                </p>
              )}
            </div>

            <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", status.dot)} />
                {status.label}
              </span>

              <span>{app.plan}</span>
            </div>

            <span className="text-muted-foreground">
              {format(new Date(app.createdAt), "MMM d")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
