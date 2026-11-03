"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useOrganizationList } from "@clerk/nextjs";
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
  activeWorkspace: WorkspaceSummary;
  workspaces: WorkspaceSummary[];
  limits: WorkspaceLimits;
  remainingApps: number;
  remainingMembers: number;
  canCreateApp: boolean;
  canInviteMember: boolean;
  canManageMembers: boolean;
  currentMemberRole: Workspace["members"][number]["role"] | null;
  switchingWorkspaceId: string | null;
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
  const { userId } = useAuth();
  const { isLoaded, setActive } = useOrganizationList();
  const [pendingWorkspaceId, setPendingWorkspaceId] = useState<string | null>(
    null
  );

  // A switch is pending until the refreshed layout resolves the selected
  // organization. No timers are needed: when the server workspace catches up,
  // this derives back to the current server data automatically.
  const switchingWorkspaceId =
    pendingWorkspaceId && pendingWorkspaceId !== workspace.id
      ? pendingWorkspaceId
      : null;

  const switchWorkspace = async (workspaceId: string) => {
    const target = workspaces.find((item) => item.id === workspaceId);

    if (!target || target.id === workspace.id) return;

    if (!isLoaded || !setActive) {
      toast.error("Workspace switching is still loading. Try again in a moment.");
      return;
    }

    if (switchingWorkspaceId && switchingWorkspaceId !== target.id) return;

    setPendingWorkspaceId(target.id);

    try {
      await setActive({
        organization: target.id,
        navigate: ({ decorateUrl }) => {
          // Clerk runs this callback after the active organization and session
          // cookies are in sync, so the refresh reads the new workspace
          // without forcing a full document reload.
          let destination = decorateUrl("/dashboard/apps");

          if (destination.startsWith("http")) {
            const url = new URL(destination);
            destination = `${url.pathname}${url.search}`;
          }

          router.push(destination);
          router.refresh();
        },
      });
    } catch {
      setPendingWorkspaceId(null);
      toast.error(`Unable to switch to ${target.name}.`);
    }
  };

  // Reflect the chosen workspace in the shell immediately. The full
  // `workspace` object stays server-resolved and is swapped in once the
  // refresh lands.
  const activeWorkspace: WorkspaceSummary =
    workspaces.find((item) => item.id === switchingWorkspaceId) ?? workspace;

  // Paid workspaces are capped by the seats purchased on the Clerk plan, not
  // by the plan-wide maximum member count. Using the purchased seat quantity
  // keeps the invite gate in sync with what Clerk will actually accept.
  const purchasedMemberSeats =
    workspace.subscription.plan === "Free" || workspace.subscription.seats === 0
      ? getWorkspaceLimits(workspace.plan).includedSeats
      : workspace.subscription.seats;
  const occupiedMemberSeats =
    workspace.members.length + workspace.pendingInvitations.length;
  const remainingMemberSlots = Math.max(
    0,
    purchasedMemberSeats - occupiedMemberSeats
  );
  const currentMemberRole =
    workspace.members.find((member) => member.id === userId)?.role ?? null;
  const canManageMembers =
    currentMemberRole === "owner" || currentMemberRole === "admin";

  const value: WorkspaceContextValue = {
    workspace,
    activeWorkspace,
    workspaces,
    limits: getWorkspaceLimits(workspace.plan),
    remainingApps: getRemainingAppSlots(workspace),
    remainingMembers: remainingMemberSlots,
    canCreateApp: canCreateAppForWorkspace(workspace),
    canInviteMember: remainingMemberSlots > 0,
    canManageMembers,
    currentMemberRole,
    switchingWorkspaceId,
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
