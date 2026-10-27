import { format } from "date-fns";
import {
  ActivityIcon,
  CalendarIcon,
  CreditCardIcon,
  KeyIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAppById, getSubscriptionByAppId } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const app = getAppById(appId);
  const subscription = getSubscriptionByAppId(appId);

  if (!app) return null;

  const maskedKey = `${app.apiKey.slice(0, 12)}${"•".repeat(10)}`;

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
              <span>Plan</span>
            </div>

            <Badge>{app.plan}</Badge>
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

            <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
              {maskedKey}
            </code>
          </div>
        </CardContent>
      </Card>

      {subscription && (
        <Card size="sm">
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>

          <CardContent className="divide-y">
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Current Plan</span>

              <span className="font-medium">
                {subscription.currency === "USD" ? "$" : ""}
                {(subscription.amount / 100).toFixed(2)}
                <span className="text-muted-foreground">
                  /{subscription.interval}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Next Billing</span>

              <span className="font-medium">
                {subscription.nextBillingDate}
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
      )}
    </div>
  );
}
