
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  Building2Icon,
  CreditCardIcon,
  LayersIcon,
  ReceiptIcon,
  UsersIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BillingHistory } from "@/components/dashboard/billing-history";
import { CancelSubscriptionButton } from "@/components/dashboard/cancel-subscription-button";
import { ManageSubscriptionButton } from "@/components/dashboard/subscription-details-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import {
  getAppCount,
  getMemberCount,
  getWorkspaceLimits,
} from "@/lib/workspace/policy";
import { isPaidPlan } from "@/lib/workspace/plan";

export const dynamic = "force-dynamic";

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-sm font-medium">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DetailRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="sm:text-right">{children}</div>
    </div>
  );
}

export default async function Page() {
  const [{ orgRole }, workspace] = await Promise.all([
    auth(),
    getDashboardWorkspace(),
  ]);

  const limits = getWorkspaceLimits(workspace.plan);
  const subscription = workspace.subscription;

  const isPaid = isPaidPlan(workspace.plan);
  const canManageBilling =
    orgRole === "org:admin" || orgRole === "org:owner";

  const canCancel =
    canManageBilling &&
    isPaid &&
    subscription.status !== "non-renewing" &&
    subscription.status !== "cancelled";

  const hasSeatCharges =
    isPaid &&
    subscription.seatAmount != null &&
    subscription.seatAmount > 0 &&
    subscription.baseAmount != null;

  const interval =
    subscription.interval === "yearly" ? "year" : "month";

  const appCount = getAppCount(workspace);
  const memberCount = getMemberCount(workspace);

  const formatAmount = (amount: number) =>
    `${subscription.currency} ${(amount / 100).toFixed(2)}`;

  const statusVariant =
    !isPaid
      ? "secondary"
      : subscription.status === "active"
        ? "success"
        : subscription.status === "non-renewing"
          ? "secondary"
          : "destructive";

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Billing
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your workspace subscription, seats and invoices.
          </p>
        </div>

        <Badge variant="outline" className="w-fit gap-1.5">
          <Building2Icon className="size-3" />
          {workspace.name}
        </Badge>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <SectionHeading title="Overview" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label="Current plan"
            value={workspace.plan}
            description={
              isPaid ? "Workspace subscription" : "Free workspace"
            }
            icon={CreditCardIcon}
          />

          <MetricCard
            label="Workspace spend"
            value={isPaid ? formatAmount(subscription.amount) : "—"}
            description={
              isPaid
                ? `Billed per ${interval}`
                : "No active subscription charges"
            }
            icon={ReceiptIcon}
          />

          <MetricCard
            label="Applications"
            value={`${appCount} / ${limits.maxApps}`}
            description="Shared workspace allowance"
            icon={LayersIcon}
          />
        </div>
      </section>

      {/* Subscription summary */}
      <Card size="sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-sm">
                Subscription
              </CardTitle>
              <CardDescription>
                Your workspace subscription and usage details.
              </CardDescription>
            </div>

            <Badge variant={statusVariant}>
              {isPaid ? subscription.status : "Free"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="divide-y">

          <DetailRow
            icon={Building2Icon}
            label="Workspace"
            description="Your billing workspace"
          >
            <span className="text-sm font-medium">
              {workspace.name}
            </span>
          </DetailRow>

          <DetailRow
            icon={CreditCardIcon}
            label="Plan"
            description="Current subscription tier"
          >
            <span className="text-sm font-medium">
              {workspace.plan}
            </span>
          </DetailRow>

          <DetailRow
            icon={UsersIcon}
            label="Seats"
            description="Members in this workspace"
          >
            <div className="text-sm font-medium">
              {subscription.seats} purchased
              <p className="text-xs font-normal text-muted-foreground">
                {memberCount} active member{memberCount === 1 ? "" : "s"}
              </p>
            </div>
          </DetailRow>

          <DetailRow
            icon={LayersIcon}
            label="Applications"
            description={
              workspace.plan === "Enterprise"
                ? "Enterprise workspace allowance"
                : "Free and Pro include one app"
            }
          >
            <span className="text-sm font-medium">
              {appCount} / {limits.maxApps}
            </span>
          </DetailRow>

          {hasSeatCharges && (
            <DetailRow
              icon={ReceiptIcon}
              label="Billing breakdown"
              description="Base subscription and additional seats"
            >
              <div className="text-sm font-medium">
                {formatAmount(subscription.amount)}
                <p className="text-xs font-normal text-muted-foreground">
                  {formatAmount(subscription.baseAmount!)} base +{" "}
                  {formatAmount(subscription.seatAmount!)} seats
                </p>
              </div>
            </DetailRow>
          )}

          <DetailRow
            icon={CalendarDaysIcon}
            label={
              subscription.status === "non-renewing"
                ? "Access until"
                : "Next billing date"
            }
            description={
              subscription.status === "non-renewing"
                ? "Your subscription will end"
                : "Your next scheduled renewal"
            }
          >
            <span className="text-sm font-medium">
              {subscription.nextBillingDate ?? "No renewal scheduled"}
            </span>
          </DetailRow>

        </CardContent>
      </Card>

      {/* Manage subscription */}
      <section className="space-y-3">
        <SectionHeading
          title="Manage subscription"
          description="Manage your workspace plan and payment settings."
        />

        <Card size="sm">
          <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg space-y-1">
              <p className="text-sm font-medium">
                {subscription.status === "non-renewing"
                  ? "Subscription ending"
                  : "Subscription settings"}
              </p>

              <p className="text-sm text-muted-foreground">
                {subscription.status === "non-renewing"
                  ? `Your subscription ends on ${
                      subscription.nextBillingDate ??
                      "the current period end"
                    }. You will retain access until then.`
                  : "Change your workspace plan, update payment details, or manage your renewal."}
              </p>

              {!canManageBilling && (
                <p className="pt-1 text-xs text-muted-foreground">
                  Only workspace owners and admins can manage billing.
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {canManageBilling && (
                <>
                  <ManageSubscriptionButton />

                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/dashboard/billing/plans" />}
                  >
                    Change plan
                    <ArrowUpRightIcon className="size-3.5" />
                  </Button>

                  {canCancel && <CancelSubscriptionButton />}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Billing history */}
      <section className="space-y-3">
        <SectionHeading
          title="Billing history"
          description="Invoices and payment statements for this workspace."
        />

        <BillingHistory />
      </section>

    </div>
  );
}
