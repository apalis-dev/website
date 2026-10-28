import Link from "next/link";
import {
  ArrowUpCircleIcon,
  Building2Icon,
  CalendarIcon,
  CreditCardIcon,
  LayersIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import {
  getAppCount,
  getMemberCount,
  getWorkspaceLimits,
} from "@/lib/workspace/policy";

export default async function Page() {
  const workspace = await getDashboardWorkspace();
  const limits = getWorkspaceLimits(workspace.plan);
  const subscription = workspace.subscription;

  const amount =
    subscription.amount > 0
      ? `${subscription.currency === "USD" ? "$" : ""}${(
          subscription.amount / 100
        ).toFixed(2)}`
      : "Free";

  return (
    <div className="space-y-6">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Workspace Plan</CardTitle>
        </CardHeader>

        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2Icon className="size-4" />
              Workspace
            </div>

            <span className="font-medium">{workspace.name}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCardIcon className="size-4" />
              Plan
            </div>

            <Badge>{workspace.plan}</Badge>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LayersIcon className="size-4" />
              Apps
            </div>

            <span className="font-medium">
              {getAppCount(workspace)} of {limits.maxApps}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="size-4" />
              Members
            </div>

            <span className="font-medium">
              {getMemberCount(workspace)} of {limits.maxMembers}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-muted-foreground">Subscription Status</span>

            <Badge
              variant={
                subscription.status === "active" ? "success" : "secondary"
              }
            >
              {subscription.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Billing</CardTitle>
        </CardHeader>

        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ReceiptIcon className="size-4" />
              Workspace cost
            </div>

            <span className="font-medium">
              {amount}

              {subscription.amount > 0 && (
                <span className="text-muted-foreground">
                  /{subscription.interval} · {subscription.seats} seat
                  {subscription.seats === 1 ? "" : "s"}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="size-4" />
              Next Billing
            </div>

            <span className="font-medium">
              {subscription.nextBillingDate ?? "—"}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-muted-foreground">Billing scope</span>

            <span className="text-sm font-medium">Shared by all apps</span>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Plan Management</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-6 rounded-lg border p-4">
            <div>
              <div className="flex items-center gap-2 font-medium">
                <ArrowUpCircleIcon className="size-4" />
                {workspace.plan === "Enterprise" ? "Manage plan" : "Change plan"}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {workspace.plan === "Enterprise"
                  ? "Manage seats, payment method, and invoices for this workspace."
                  : "Upgrade to Enterprise to add more apps and invite teammates. Your apps and API keys stay the same."}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              render={<Link href="/dashboard/billing" />}
            >
              {workspace.plan === "Enterprise" ? "Manage billing" : "Upgrade"}
            </Button>
          </div>

          <div className="rounded-lg border border-dashed p-4">
            <p className="text-sm text-muted-foreground">
              Billing is managed at the workspace level. There is no separate
              subscription for this application.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
