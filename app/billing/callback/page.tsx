import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { validateProPayment, verifyTransaction } from "@/lib/billing/paystack";
import { recordSuccessfulPayment } from "@/lib/billing/store";
import { Button } from "@/components/ui/button";

export default async function BillingCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const { reference } = await searchParams;
  let isPaid = false;
  let message = "We could not verify this payment.";

  if (reference && /^[A-Za-z0-9._-]+$/.test(reference)) {
    try {
      const transaction = await verifyTransaction(reference);
      const belongsToUser = transaction.metadata?.userId === session.user.id;
      const interval = transaction.metadata?.interval === "annually" ? "annually" : "monthly";

      isPaid = belongsToUser && (await validateProPayment(transaction, interval));
      if (isPaid) {
        recordSuccessfulPayment({
          reference: transaction.reference,
          userId: session.user.id,
          amount: transaction.amount,
          currency: transaction.currency,
          paidAt: transaction.paid_at,
          interval,
          subscriptionCode: transaction.subscription?.subscription_code,
          emailToken: transaction.subscription?.email_token,
        });
      }
      message = isPaid
        ? "Your payment was verified. Your subscription will update shortly."
        : "This payment could not be matched to your account.";
    } catch {
      message = "We could not verify this payment yet. Please try again shortly.";
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-6">
      <section className="w-full rounded-xl border bg-background p-8 text-center shadow-sm">
        <p className={isPaid ? "text-sm font-medium text-emerald-600" : "text-sm font-medium text-destructive"}>
          {isPaid ? "Payment verified" : "Payment needs attention"}
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Billing update</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <Button className="mt-6" render={<Link href="/dashboard/billing" />}>
          Return to billing
        </Button>
      </section>
    </main>
  );
}
