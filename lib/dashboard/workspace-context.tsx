"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";
import { toast } from "sonner";

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
  switchWorkspace: (workspaceId: string) => Promise<void>;
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
  const { isLoaded, setActive } = useOrganizationList();

  const switchWorkspace = async (workspaceId: string) => {
    const target = workspaces.find((item) => item.id === workspaceId);

    if (!target || target.id === workspace.id) return;

    if (!isLoaded || !setActive) {
      toast.error("Workspace switching is still loading. Try again in a moment.");
      return;
    }

    try {
      await setActive({ organization: target.id });
      router.push("/dashboard/apps");
      router.refresh();
    } catch {
      toast.error(`Unable to switch to ${target.name}.`);
    }
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
