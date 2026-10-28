"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { ChevronRightIcon } from "lucide-react";

import { useWorkspace } from "@/lib/dashboard/workspace-context";
import { AppSwitcher } from "@/components/dashboard/app-switcher";

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  apps: "Apps",
  subscription: "Plan",
  tickets: "Tickets",
  settings: "Settings",
  billing: "Billing",
  "api-keys": "API Keys",
  new: "New",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const { workspace } = useWorkspace();

  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);

  function getLabel(segment: string) {
    const app = workspace.apps.find((item) => item.id === segment);

    if (app) return app.name;

    return segmentLabels[segment] ?? segment;
  }

  return (
    <nav className="flex items-center gap-1 overflow-hidden text-sm">
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const isApp = workspace.apps.some((app) => app.id === segment);

        return (
          <Fragment key={href}>
            {index > 0 && (
              <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
            )}

            {isApp ? (
              <AppSwitcher currentAppId={segment} pathname={pathname} />
            ) : isLast ? (
              <span className="truncate font-medium text-foreground">
                {getLabel(segment)}
              </span>
            ) : (
              <Link
                href={href as any}
                className="truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {getLabel(segment)}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
