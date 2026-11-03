"use client";

import { BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function DashboardHeader() {
  const { state } = useSidebar();

  return (
    <header className="flex h-14 items-center bg-background">
      <div
        className="flex h-full shrink-0 items-center gap-2 px-2 transition-[width] duration-200 ease-[var(--ease-in-out)]"
        style={{ width: state === "collapsed" ? "var(--sidebar-width-icon)" : "var(--sidebar-width)" }}
      >
        <Avatar>
          <AvatarImage src="/images/logo.svg" alt="Apalis" />
          <AvatarFallback className="text-sm font-medium">CN</AvatarFallback>
        </Avatar>
        <SidebarTrigger className="size-8" />
      </div>

      <Separator orientation="vertical" className="h-4! ml-4" />
      {state === "expanded" && <DashboardBreadcrumb />}

      <Button
        variant="ghost"
        size="icon"
        className="size-8 ml-auto mr-2"
        aria-label="Notifications"
      >
        <BellIcon className="size-4" />
      </Button>
    </header>
  );
}
