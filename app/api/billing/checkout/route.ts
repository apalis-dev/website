import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  initializeProSubscription,
  type BillingInterval,
} from "@/lib/billing/paystack";

const checkoutSchema = z.object({
  interval: z.enum(["monthly", "annually"]).default("monthly"),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Please sign in to continue." },
      { status: 401 }
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
      email: session.user.email,
      userId: session.user.id,
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
