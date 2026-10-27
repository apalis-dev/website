import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { disableSubscription } from "@/lib/billing/paystack";
import { getBillingSummary, updateSubscriptionStatus } from "@/lib/billing/store";

export const runtime = "nodejs";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const { subscription } = getBillingSummary(userId);

  if (!subscription || subscription.status !== "active") {
    return NextResponse.json({ error: "There is no active subscription to cancel." }, { status: 400 });
  }

  if (!subscription.paystackSubscriptionCode || !subscription.paystackEmailToken) {
    return NextResponse.json(
      { error: "This subscription cannot be cancelled automatically yet. Contact support." },
      { status: 409 }
    );
  }

  try {
    await disableSubscription({
      subscriptionCode: subscription.paystackSubscriptionCode,
      emailToken: subscription.paystackEmailToken,
    });
    updateSubscriptionStatus(userId, "non-renewing");

    return NextResponse.json({ status: "non-renewing" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to cancel subscription.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
