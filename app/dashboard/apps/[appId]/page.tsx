import Link from "next/link";
import { format } from "date-fns";
import {
  ActivityIcon,
  Building2Icon,
  CalendarIcon,
  CreditCardIcon,
  KeyIcon,
  LayersIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getApiKeyPreview,
  getAppById,
} from "@/lib/dashboard/mock-data";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import {
  getAppCount,
  getMemberCount,
  getWorkspaceLimits,
} from "@/lib/workspace/policy";
import { cn } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const workspace = await getDashboardWorkspace();
  const app = getAppById(workspace, appId);

  if (!app) return null;

  const limits = getWorkspaceLimits(workspace.plan);
  const apiKeyPreview = getApiKeyPreview(app);

  const statusColor = {
    active: "bg-brand",
    inactive: "bg-muted-foreground",
    pending: "bg-amber-500",
  }[app.status];

  return (
    <div className="space-y-6">
      <Card size="sm">
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>

        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ActivityIcon className="size-4" />
              <span>Status</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", statusColor)} />
              <span className="capitalize font-medium">{app.status}</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCardIcon className="size-4" />
              <span>Workspace plan</span>
            </div>

            <Badge>{workspace.plan}</Badge>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="size-4" />
              <span>Created</span>
            </div>

            <span className="font-medium">
              {format(new Date(app.createdAt), "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <KeyIcon className="size-4" />
              <span>API Key</span>
            </div>

            {apiKeyPreview ? (
              <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                {apiKeyPreview}
              </code>
            ) : (
              <span className="text-sm text-muted-foreground">Not created</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="divide-y">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2Icon className="size-4" />
                <span>Workspace</span>
              </div>

              <span className="font-medium">{workspace.name}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <LayersIcon className="size-4" />
                <span>Apps</span>
              </div>

              <span className="font-medium">
                {getAppCount(workspace)} of {limits.maxApps}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UsersIcon className="size-4" />
                <span>Members</span>
              </div>

              <span className="font-medium">
                {getMemberCount(workspace)} of {limits.maxMembers}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            render={<Link href="/dashboard/billing" />}
          >
            Manage workspace billing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
