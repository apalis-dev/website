import { notFound } from "next/navigation";

import { AppHeader } from "@/components/dashboard/app-header";
import { getAppById } from "@/lib/dashboard/mock-data";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";

export default async function AppDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const workspace = await getDashboardWorkspace();
  const app = getAppById(workspace, appId);

  if (!app) notFound();

  return (
    <div className="space-y-6">
      <AppHeader app={app} workspacePlan={workspace.plan} />
      {children}
    </div>
  );
}
