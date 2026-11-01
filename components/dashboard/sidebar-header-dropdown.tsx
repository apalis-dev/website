"use client";

import Link from "next/link";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  PlusIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useWorkspace } from "@/lib/dashboard/workspace-context";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SidebarHeaderDropdown() {
  const { state } = useSidebar();
  const { workspace, workspaces, switchWorkspace } = useWorkspace();
  const collapsed = state === "collapsed";
  const initials = getInitials(workspace.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8 shrink-0">
              {workspace.imageUrl && (
                <AvatarImage src={workspace.imageUrl} alt={workspace.name} />
              )}

              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">
                    {workspace.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {workspace.plan} workspace
                  </p>
                </div>

                <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
              </>
            )}
          </button>
        }
      />

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {workspaces.map((item) => {
            const isActive = item.id === workspace.id;

            return (
              <DropdownMenuItem
                key={item.id}
                onClick={() => switchWorkspace(item.id)}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium",
                    isActive && "bg-foreground text-background"
                  )}
                >
                  {getInitials(item.name)}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate">{item.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.plan}
                  </span>
                </span>

                {isActive && <CheckIcon className="size-4 text-brand" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link
                href="/select-workspace"
                className="flex cursor-pointer items-center gap-3"
              />
            }
          >
            <PlusIcon className="size-4" />
            Create workspace
          </DropdownMenuItem>

          <DropdownMenuItem
            render={
              <Link
                href="/dashboard/billing"
                className="flex cursor-pointer items-center gap-3"
              />
            }
          >
            <CreditCardIcon className="size-4" />
            Workspace billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
