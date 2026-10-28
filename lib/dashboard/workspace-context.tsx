"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import type { Workspace, WorkspaceSummary } from "@/lib/dashboard/types";
import {
  canCreateApp as canCreateAppForWorkspace,
  canInviteMember as canInviteMemberForWorkspace,
  getRemainingAppSlots,
  getRemainingMemberSlots,
  getWorkspaceLimits,
  type WorkspaceLimits,
} from "@/lib/workspace/policy";

interface WorkspaceContextValue {
  workspace: Workspace;
  workspaces: WorkspaceSummary[];
  limits: WorkspaceLimits;
  remainingApps: number;
  remainingMembers: number;
  canCreateApp: boolean;
  canInviteMember: boolean;
  switchWorkspace: (workspaceId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  workspace: Workspace;
  workspaces: WorkspaceSummary[];
  children: ReactNode;
}

export function WorkspaceProvider({
  workspace,
  workspaces,
  children,
}: WorkspaceProviderProps) {
  const router = useRouter();

  const switchWorkspace = (workspaceId: string) => {
    const target = workspaces.find((item) => item.id === workspaceId);

    if (!target || target.id === workspace.id) return;

    // Dev-only bridge. Production switches the active Clerk organization.
    document.cookie = `apalis_workspace=${target.plan.toLowerCase()}; path=/; max-age=31536000; samesite=lax`;
    router.push("/dashboard/apps");
    router.refresh();
  };

  const value: WorkspaceContextValue = {
    workspace,
    workspaces,
    limits: getWorkspaceLimits(workspace.plan),
    remainingApps: getRemainingAppSlots(workspace),
    remainingMembers: getRemainingMemberSlots(workspace),
    canCreateApp: canCreateAppForWorkspace(workspace),
    canInviteMember: canInviteMemberForWorkspace(workspace),
    switchWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider.");
  }

  return context;
}
