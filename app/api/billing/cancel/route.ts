import { auth, clerkClient } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { NextResponse } from "next/server";

import { isCancelablePaidSubscriptionItem } from "@/lib/workspace/plan";

export const runtime = "nodejs";

/**
 * Cancels the active workspace subscription at the end of the current billing
 * period. Clerk remains the source of truth; the UI re-reads the subscription
 * after this call instead of keeping local billing state.
 */
export async function POST() {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to continue." },
      { status: 401 }
    );
  }

  if (!orgId) {
    return NextResponse.json(
      { error: "Choose a workspace before managing billing." },
      { status: 400 }
    );
  }

  if (orgRole !== "org:admin" && orgRole !== "org:owner") {
    return NextResponse.json(
      { error: "Only workspace admins can cancel the subscription." },
      { status: 403 }
    );
  }

  const client = await clerkClient();

  let subscription;

  try {
    subscription = await client.billing.getOrganizationBillingSubscription(
      orgId
    );
  } catch (error) {
    if (isClerkAPIResponseError(error) && error.status === 404) {
      return NextResponse.json(
        { error: "This workspace does not have an active subscription." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "We couldn't load this workspace's subscription." },
      { status: 502 }
    );
  }

  const item = subscription.subscriptionItems.find(
    (subscriptionItem) =>
      isCancelablePaidSubscriptionItem(subscriptionItem) &&
      !subscriptionItem.canceledAt
  );

  if (!item) {
    return NextResponse.json(
      {
        error:
          "This workspace has no paid subscription renewal to cancel. It may already be set to end.",
      },
      { status: 409 }
    );
  }

  try {
    const cancelled = await client.billing.cancelSubscriptionItem(item.id, {
      endNow: false,
    });

    return NextResponse.json({
      status: "non-renewing",
      endsAt: cancelled.periodEnd
        ? new Date(cancelled.periodEnd).toISOString()
        : null,
    });
  } catch (error) {
    if (isClerkAPIResponseError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 502 }
      );
    }

    return NextResponse.json(
      { error: "We couldn't cancel this subscription. Try again." },
      { status: 502 }
    );
  }
}
