import { getAppById } from "@/lib/dashboard/mock-data";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import { AppSettingsContent } from "@/components/dashboard/app-settings-content";

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const workspace = await getDashboardWorkspace();
  const app = getAppById(workspace, appId);

  if (!app) return null;

  return <AppSettingsContent app={app} />;
}
