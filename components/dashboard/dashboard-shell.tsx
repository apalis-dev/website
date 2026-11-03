"use client";

import { ReactNode } from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { AppsPageSkeleton } from "@/components/dashboard/apps-page-skeleton";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useWorkspace } from "@/lib/dashboard/workspace-context";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { activeWorkspace, switchingWorkspaceId } = useWorkspace();

  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width": "12rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <div className="fixed inset-0 z-40 flex flex-col bg-muted/40">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <SidebarInset className="overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full min-h-full p-4 sm:p-6 border rounded-lg bg-background border-border">
                {switchingWorkspaceId ? (
                  <AppsPageSkeleton workspaceName={activeWorkspace.name} />
                ) : (
                  children
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
