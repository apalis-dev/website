import { NextResponse } from "next/server";

import {
  isValidPaystackSignature,
  validateProPayment,
  verifyTransaction,
} from "@/lib/billing/paystack";
import {
  findSubscriptionByPaystackCode,
  recordSuccessfulPayment,
  updateSubscriptionStatus,
} from "@/lib/billing/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    if (!isValidPaystackSignature(rawBody, request.headers.get("x-paystack-signature"))) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Webhook configuration is incomplete." }, { status: 500 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
        metadata?: { userId?: string; interval?: "monthly" | "annually" };
        subscription?: { subscription_code?: string };
        subscription_code?: string;
      };
    };

    const subscriptionCode =
      event.data?.subscription?.subscription_code ?? event.data?.subscription_code;

    if (event.event === "charge.success" && event.data?.reference) {
      // Never grant access from the webhook payload itself. Fetch Paystack's
      // canonical transaction and match its configured plan and amount.
      const transaction = await verifyTransaction(event.data.reference);
      const interval =
        transaction.metadata?.interval === "annually" ? "annually" : "monthly";
      const userId =
        transaction.metadata?.userId ??
        (subscriptionCode
          ? findSubscriptionByPaystackCode(subscriptionCode)?.userId
          : undefined);

      if (userId && (await validateProPayment(transaction, interval))) {
        recordSuccessfulPayment({
          reference: transaction.reference,
          userId,
          amount: transaction.amount,
          currency: transaction.currency,
          paidAt: transaction.paid_at,
          interval,
          subscriptionCode: transaction.subscription?.subscription_code ?? subscriptionCode,
          emailToken: transaction.subscription?.email_token,
        });
      }
    }

    if (subscriptionCode) {
      const subscription = findSubscriptionByPaystackCode(subscriptionCode);

      if (subscription) {
        if (event.event === "subscription.not_renew") {
          updateSubscriptionStatus(subscription.userId, "non-renewing");
        } else if (event.event === "subscription.disable") {
          updateSubscriptionStatus(subscription.userId, "cancelled");
        } else if (event.event === "invoice.payment_failed") {
          updateSubscriptionStatus(subscription.userId, "payment-failed");
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }
}
