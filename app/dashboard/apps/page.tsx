import Link from "next/link";
import { PlusIcon, SearchIcon, ArrowUpDownIcon } from "lucide-react";

import { AppCard } from "@/components/dashboard/app-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import { canCreateApp, getWorkspaceLimits } from "@/lib/workspace/policy";

export default async function Apps() {
  const workspace = await getDashboardWorkspace();
  const limits = getWorkspaceLimits(workspace.plan);
  const appCount = workspace.apps.length;
  const appLimitReached = !canCreateApp(workspace);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Apps</h1>

          <p className="text-sm text-muted-foreground">
            Manage applications in {workspace.name}.
          </p>
        </div>

        {appLimitReached ? (
          <Button disabled title="This workspace has reached its app limit.">
            <PlusIcon className="size-4" />
            New App
          </Button>
        ) : (
          <Button render={<Link href="/dashboard/apps/new" />}>
            <PlusIcon className="size-4" />
            New App
          </Button>
        )}
      </div>

      {appLimitReached && (
        <div className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">
              {workspace.plan} workspaces include {limits.maxApps} app
              {limits.maxApps === 1 ? "" : "s"}.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {workspace.plan === "Enterprise"
                ? "You have reached the metadata-safe app limit for this workspace."
                : "Upgrade to Enterprise to add more apps and invite teammates."}
            </p>
          </div>

          <Button variant="outline" render={<Link href="/dashboard/billing" />}>
            {workspace.plan === "Enterprise" ? "View billing" : "Upgrade plan"}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search applications..." className="pl-9" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {appCount} of {limits.maxApps} apps
          </span>

          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <ArrowUpDownIcon className="size-4" />
            Sort
          </Button>
        </div>
      </div>

      <Separator />

      {workspace.apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
          <h3 className="text-base font-medium">No applications yet</h3>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first application to start receiving webhooks.
          </p>

          <Button className="mt-6" render={<Link href="/dashboard/apps/new" />}>
            <PlusIcon className="size-4" />
            New App
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {workspace.apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
