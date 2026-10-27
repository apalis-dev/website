import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  initializeProSubscription,
  type BillingInterval,
} from "@/lib/billing/paystack";

const checkoutSchema = z.object({
  interval: z.enum(["monthly", "annually"]).default("monthly"),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to continue." },
      { status: 401 }
    );
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json(
      { error: "Please add an email address to your account." },
      { status: 400 }
    );
  }

  const parsedCheckoutResponse = checkoutSchema.safeParse(
    await request.json().catch(() => ({}))
  );

  if (!parsedCheckoutResponse.success) {
    return NextResponse.json(
      { error: "Invalid subscription interval." },
      { status: 400 }
    );
  }

  try {
    const transaction = await initializeProSubscription({
      email,
      userId,
      interval: parsedCheckoutResponse.data.interval as BillingInterval,
    });

    return NextResponse.json({
      authorizationUrl: transaction.authorization_url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start checkout.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
