import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PricingTable } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function BillingPlansPage() {
  const { orgRole } = await auth();

  if (orgRole !== "org:admin" && orgRole !== "org:owner") {
    redirect("/dashboard/billing");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/dashboard/billing" />}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Change plan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrading from Pro to Enterprise is a plan change on this workspace.
            Apps, API keys and members stay in place.
          </p>
        </div>
      </div>

      <PricingTable
        for="organization"
        newSubscriptionRedirectUrl="/dashboard/billing"
      />
    </div>
  );
}
