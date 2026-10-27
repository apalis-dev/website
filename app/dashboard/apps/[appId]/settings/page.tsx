import { getAppById } from "@/lib/dashboard/mock-data";
import { AppSettingsContent } from "@/components/dashboard/app-settings-content";

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const app = getAppById(appId);

  if (!app) return null;

  return <AppSettingsContent app={app} />;
}