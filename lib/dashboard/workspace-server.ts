import { cache } from "react";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

import {
  getMockWorkspace,
  getWorkspaceSummary,
  mockWorkspaceList,
} from "./mock-data";
import type { Workspace, WorkspaceSummary } from "./types";

/**
 * Dev-only bridge while the Clerk organization + Billing adapter is being
 * wired. Set DASHBOARD_MOCK_WORKSPACE to "free" | "pro" | "enterprise" to
 * preview a scenario. Production must resolve auth().orgId, read org
 * publicMetadata, and derive the plan from Clerk Billing instead.
 */
export const getDashboardWorkspace = cache(async (): Promise<Workspace> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("A signed-in user is required to load a workspace.");
  }

  const cookieStore = await cookies();
  const selectedWorkspace = cookieStore.get("apalis_workspace")?.value;

  return getMockWorkspace(
    selectedWorkspace ?? process.env.DASHBOARD_MOCK_WORKSPACE
  );
});

export const getAvailableWorkspaces = cache(
  async (): Promise<WorkspaceSummary[]> => {
    // TODO(workspace-migration): replace with the signed-in user's Clerk
    // organization memberships.
    return mockWorkspaceList.map(getWorkspaceSummary);
  }
);
