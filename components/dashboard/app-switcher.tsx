"use client";

import Link from "next/link";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useWorkspace } from "@/lib/dashboard/workspace-context";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppSwitcherProps {
  currentAppId: string;
  pathname: string;
}

export function AppSwitcher({ currentAppId, pathname }: AppSwitcherProps) {
  const { workspace } = useWorkspace();
  const apps = workspace.apps;
  const current = apps.find((app) => app.id === currentAppId);

  const segments = pathname.split("/").filter(Boolean);
  const appIndex = segments.findIndex((segment) =>
    apps.some((app) => app.id === segment)
  );
  const tail = segments.slice(appIndex + 1).join("/");

  if (apps.length <= 1) {
    return (
      <span className="font-medium text-foreground">
        {current?.name ?? "Application"}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-foreground transition-colors hover:bg-accent">
        {current?.name}
        <ChevronDownIcon className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch application</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {apps.map((app) => (
            <DropdownMenuItem
              key={app.id}
              render={
                <Link
                  href={`/dashboard/apps/${app.id}${tail ? `/${tail}` : ""}`}
                />
              }
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-md text-xs font-medium text-white",
                  app.color
                )}
              >
                {app.icon}
              </span>

              <span className="truncate">{app.name}</span>

              {app.id === currentAppId && (
                <CheckIcon className="ml-auto size-4 text-brand" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
