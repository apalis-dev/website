import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AppTabs } from "@/components/dashboard/app-tabs";
import type { DashboardApp } from "@/lib/dashboard/types";

interface AppHeaderProps {
  app: DashboardApp;
}

export function AppHeader({ app }: AppHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-lg font-mono text-base font-medium text-white",
            app.color
          )}
        >
          {app.icon}
        </div>
        <div className="min-w-0 space-y-1">
          <h1 className="truncate font-mono text-base font-medium">
            {app.name}
          </h1>
          {app.description && (
            <p className="truncate text-sm text-muted-foreground">
              {app.description}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="uppercase">
            {app.status}
          </Badge>
          <Badge>{app.plan}</Badge>
        </div>
      </div>

      <AppTabs appId={app.id} />
    </div>
  );
}