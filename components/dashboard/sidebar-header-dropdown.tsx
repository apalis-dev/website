"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { mockApps } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

interface SidebarHeaderDropdownProps {
  name: string;
  initials: string;
}

export function SidebarHeaderDropdown({
  name,
  initials,
}: SidebarHeaderDropdownProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname() ?? "";

  const activeApp = mockApps.find((app) =>
    pathname.startsWith(`/dashboard/apps/${app.id}`)
  );

  const tail = (() => {
    if (!activeApp) return "";
    const segments = pathname.split("/").filter(Boolean);
    const appIndex = segments.findIndex((s) => s === activeApp.id);
    return segments.slice(appIndex + 1).join("/");
  })();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">
                    {activeApp?.name ?? name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {activeApp ? `${activeApp.plan} plan` : "Personal"}
                  </p>
                </div>

                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </>
            )}
          </button>
        }
      />

      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Applications</DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {mockApps.map((app) => {
            const href = `/dashboard/apps/${app.id}${tail ? `/${tail}` : ""}`;
            const isActive = activeApp?.id === app.id;

            return (
              <DropdownMenuItem
                key={app.id}
                render={<Link href={href as any} />}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-medium text-white",
                    app.color
                  )}
                >
                  {app.icon}
                </span>
                <span className="truncate">{app.name}</span>
                {isActive && <CheckIcon className="ml-auto size-4 text-brand" />}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuItem render={<Link href="/dashboard/apps/new" />}>
            <PlusIcon className="size-4" />
            <span>Create application</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}