import {
  CreditCardIcon,
  CalendarIcon,
  ReceiptIcon,
  ArrowUpCircleIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubscriptionByAppId } from "@/lib/dashboard/mock-data";

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const subscription = getSubscriptionByAppId(appId);

  if (!subscription) return null;

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
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>

        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCardIcon className="size-4" />
              Plan
            </div>

            <Badge>{subscription.plan}</Badge>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ReceiptIcon className="size-4" />
              Monthly Cost
            </div>

            <span className="font-medium">
              {amount}

              {subscription.amount > 0 && (
                <span className="text-muted-foreground">
                  /{subscription.interval}
                </span>
              )}
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
              <CalendarIcon className="size-4" />
              Next Billing
            </div>

            <span className="font-medium">{subscription.nextBillingDate}</span>
          </div>

          {subscription.paystackReference && (
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Payment Reference</span>

              <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                {subscription.paystackReference}
              </code>
            </div>
          )}
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
                Change Plan
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade or downgrade your subscription at any time.
              </p>
            </div>

            <Button variant="outline" size="sm">
              Change Plan
            </Button>
          </div>

          <div className="flex items-start justify-between gap-6 rounded-lg border border-destructive/20 p-4">
            <div>
              <div className="flex items-center gap-2 font-medium">
                <ShieldAlertIcon className="size-4 text-destructive" />
                Cancel Subscription
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Your subscription will remain active until the end of the
                current billing cycle.
              </p>
            </div>

            <Button variant="destructive" size="sm">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
