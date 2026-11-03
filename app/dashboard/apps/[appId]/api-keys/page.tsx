import { getAppById, getApiKeyPreview } from "@/lib/dashboard/mock-data";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import { ApiKeyPage } from "@/components/dashboard/app-api-key-content";

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const workspace = await getDashboardWorkspace();
  const app = getAppById(workspace, appId);

  if (!app) return null;

  return (
    <ApiKeyPage
      apiKeyId={app.apiKeyId}
      apiKeyPreview={getApiKeyPreview(app)}
    />
  );
}
