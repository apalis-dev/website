import Link from "next/link";
import {
  Building2Icon,
  CreditCardIcon,
  LayersIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import {
  getAppCount,
  getMemberCount,
  getWorkspaceLimits,
} from "@/lib/workspace/policy";

export const dynamic = "force-dynamic";

export default async function Page() {
  const workspace = await getDashboardWorkspace();
  const limits = getWorkspaceLimits(workspace.plan);
  const subscription = workspace.subscription;
  const isPaid = subscription.amount > 0;
  const interval = subscription.interval === "yearly" ? "year" : "month";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the {workspace.name} plan, seats and invoices.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Current Plan</CardDescription>
            <CardTitle className="text-2xl">{workspace.plan}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={isPaid ? "success" : "secondary"}>
              {isPaid ? "Active" : "Free"}
            </Badge>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Workspace Spend</CardDescription>
            <CardTitle className="text-2xl">
              {isPaid
                ? `${subscription.currency} ${(subscription.amount / 100).toFixed(2)}`
                : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {isPaid
                ? `Billed per ${interval} for ${subscription.seats} seat${
                    subscription.seats === 1 ? "" : "s"
                  }`
                : "Upgrade to unlock more apps"}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Apps</CardDescription>
            <CardTitle className="text-2xl">
              {getAppCount(workspace)} / {limits.maxApps}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Shared workspace allowance
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            One subscription applies to every app in this workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Building2Icon className="size-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Workspace</p>
                <p className="text-sm text-muted-foreground">
                  {workspace.name}
                </p>
              </div>
            </div>

            <span className="font-mono text-xs text-muted-foreground">
              {workspace.id}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="size-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Plan</p>
                <p className="text-sm text-muted-foreground">
                  {workspace.plan}
                </p>
              </div>
            </div>

            <Badge variant={isPaid ? "success" : "secondary"}>
              {subscription.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Seats</p>
                <p className="text-sm text-muted-foreground">
                  {getMemberCount(workspace)} member
                  {getMemberCount(workspace) === 1 ? "" : "s"} in this workspace
                </p>
              </div>
            </div>

            <span className="font-medium">
              {subscription.seats} / {limits.maxMembers}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <LayersIcon className="size-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Apps</p>
                <p className="text-sm text-muted-foreground">
                  {workspace.plan === "Enterprise"
                    ? "Enterprise workspace allowance"
                    : "Free and Pro include one app"}
                </p>
              </div>
            </div>

            <span className="font-medium">
              {getAppCount(workspace)} / {limits.maxApps}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <ReceiptIcon className="size-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Next invoice</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.nextBillingDate ?? "No renewal"}
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" render={<Link href="/dashboard/apps" />}>
              View apps
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clerk Billing</CardTitle>
          <CardDescription>
            Checkout, payment method and invoices move to Clerk Billing for the
            workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            This is a read-only view during the billing migration. Paystack is
            no longer used for new subscriptions. Connect the Clerk org plans to
            enable checkout and invoice downloads.
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium">Billing History</h2>
          <p className="text-sm text-muted-foreground">
            Invoices will appear here once Clerk Billing is connected.
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Invoice
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Amount
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No invoices yet.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
