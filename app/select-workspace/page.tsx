import { auth } from "@clerk/nextjs/server";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { WorkspacePicker } from "@/components/dashboard/workspace-picker";
import { getAvailableWorkspaces } from "@/lib/dashboard/workspace-server";

export const dynamic = "force-dynamic";

interface SelectWorkspacePageProps {
  searchParams: Promise<{
    redirectUrl?: string | string[];
    redirect_url?: string | string[];
  }>;
}

/** Only allow same-site relative paths as post-selection destinations. */
function getSafeRedirect(value: string | string[] | undefined): string | null {
  const target = Array.isArray(value) ? value[0] : value;

  if (!target || !target.startsWith("/") || target.startsWith("//")) {
    return null;
  }

  return target;
}

export default async function SelectWorkspacePage({
  searchParams,
}: SelectWorkspacePageProps) {
  // A pending session (choose-organization task) is treated as signed-out by
  // default. This page exists to finish that task, so read it as signed-in.
  const [{ userId, orgId }, params] = await Promise.all([
    auth({ treatPendingAsSignedOut: false }),
    searchParams,
  ]);

  if (!userId) {
    redirect("/login");
  }

  const redirectUrl =
    getSafeRedirect(params.redirectUrl) ?? getSafeRedirect(params.redirect_url);

  // After the organization is chosen, Clerk sends the user back here with the
  // original destination. At that point the session task is complete.
  if (orgId && redirectUrl) {
    redirect(redirectUrl as Route);
  }

  const workspaces = await getAvailableWorkspaces();

  return (
    <WorkspacePicker
      workspaces={workspaces}
      activeWorkspaceId={orgId ?? null}
    />
  );
}
