import Link from "next/link";
import {
  ArrowLeftIcon,
  LockIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewAppForm } from "@/components/dashboard/new-app-form";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import {
  canCreateApp,
  getRemainingAppSlots,
  getWorkspaceLimits,
} from "@/lib/workspace/policy";

export default async function Page() {
  const workspace = await getDashboardWorkspace();
  const limits = getWorkspaceLimits(workspace.plan);
  const allowed = canCreateApp(workspace);

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/dashboard/apps" />}
            className="mt-1"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              <SparklesIcon className="size-3.5" />
              {workspace.name}
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Create Application
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Applications isolate API keys, environments and webhooks. Plan,
                seats and billing are shared across the workspace.
              </p>
            </div>
          </div>
        </div>
      </div>

      {allowed ? (
        <NewAppForm
          plan={workspace.plan}
          remainingApps={getRemainingAppSlots(workspace)}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <LockIcon className="size-5 text-muted-foreground" />
            </div>
            <CardTitle className="mt-3">App limit reached</CardTitle>
            <CardDescription>
              {workspace.plan} workspaces include {limits.maxApps} app
              {limits.maxApps === 1 ? "" : "s"}. You are using all of them.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {workspace.plan === "Enterprise"
                ? "This workspace has reached the metadata-safe app limit. Delete an app before creating another."
                : "Upgrade this workspace to Enterprise to add more apps and invite teammates. Your existing app and API key stay the same."}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                nativeButton={false}
                render={<Link href="/dashboard/billing" />}
              >
                {workspace.plan === "Enterprise"
                  ? "View billing"
                  : "Upgrade workspace"}
              </Button>

              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/dashboard/apps" />}
              >
                Back to apps
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div />
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
              <CardDescription>
                After creating your application you&apos;ll be able to configure
                it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex gap-3">
                <div className="mt-0.5 flex size-6 items-center justify-center rounded-full border text-xs font-medium">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium">Generate an API key</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Authenticate requests securely.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <div className="mt-0.5 flex size-6 items-center justify-center rounded-full border text-xs font-medium">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium">Configure webhooks</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Receive real-time events in your backend.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <div className="mt-0.5 flex size-6 items-center justify-center rounded-full border text-xs font-medium">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">Invite teammates</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Collaborate within the workspace without sharing credentials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Good to know</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Every application receives its own API key and webhook
                endpoints.
              </p>
              <p>
                Apps share the workspace plan and billing. Free and Pro
                workspaces include one app; Enterprise workspaces support more.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
