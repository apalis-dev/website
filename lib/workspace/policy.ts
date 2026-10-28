import type { Workspace, WorkspacePlan } from "@/lib/dashboard/types";

export interface WorkspaceLimits {
  maxApps: number;
  maxMembers: number;
  includedSeats: number;
  requiresB2BAddOnAbove: number | null;
}

export const WORKSPACE_LIMITS: Record<WorkspacePlan, WorkspaceLimits> = {
  Free: {
    maxApps: 1,
    maxMembers: 1,
    includedSeats: 1,
    requiresB2BAddOnAbove: null,
  },
  Pro: {
    maxApps: 1,
    maxMembers: 1,
    includedSeats: 1,
    requiresB2BAddOnAbove: null,
  },
  Enterprise: {
    maxApps: 10,
    maxMembers: 20,
    includedSeats: 20,
    requiresB2BAddOnAbove: 20,
  },
};

export function getWorkspaceLimits(plan: WorkspacePlan): WorkspaceLimits {
  return WORKSPACE_LIMITS[plan];
}

export function getAppCount(workspace: Workspace): number {
  return workspace.apps.length;
}

export function getMemberCount(workspace: Workspace): number {
  return workspace.members.length;
}

export function getRemainingAppSlots(workspace: Workspace): number {
  return Math.max(
    0,
    getWorkspaceLimits(workspace.plan).maxApps - getAppCount(workspace)
  );
}

export function getRemainingMemberSlots(workspace: Workspace): number {
  return Math.max(
    0,
    getWorkspaceLimits(workspace.plan).maxMembers - getMemberCount(workspace)
  );
}

export function canCreateApp(workspace: Workspace): boolean {
  return getRemainingAppSlots(workspace) > 0;
}

export function canInviteMember(workspace: Workspace): boolean {
  return getRemainingMemberSlots(workspace) > 0;
}

export function assertCanCreateApp(workspace: Workspace): void {
  if (!canCreateApp(workspace)) {
    throw new Error(
      `${workspace.plan} workspaces can have ${getWorkspaceLimits(workspace.plan).maxApps} app(s). Upgrade the workspace to add more.`
    );
  }
}

export function assertCanInviteMember(workspace: Workspace): void {
  if (!canInviteMember(workspace)) {
    throw new Error(
      `${workspace.plan} workspaces can have ${getWorkspaceLimits(workspace.plan).maxMembers} member(s). Upgrade the workspace to add more.`
    );
  }
}
