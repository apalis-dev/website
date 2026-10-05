import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { disableSubscription } from "@/lib/billing/paystack";
import { getBillingSummary, updateSubscriptionStatus } from "@/lib/billing/store";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const { subscription } = getBillingSummary(session.user.id);

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
    updateSubscriptionStatus(session.user.id, "non-renewing");

    return NextResponse.json({ status: "non-renewing" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to cancel subscription.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
