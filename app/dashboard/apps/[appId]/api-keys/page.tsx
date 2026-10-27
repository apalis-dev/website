import { getAppById } from "@/lib/dashboard/mock-data";
import { ApiKeyPage } from "@/components/dashboard/app-api-key-content";

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const app = getAppById(appId);

  if (!app) return null;

  return <ApiKeyPage apiKey={app.apiKey} />;
}