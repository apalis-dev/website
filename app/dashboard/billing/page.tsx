import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CancelSubscriptionButton,
  CreditCardIcon,
  DownloadInvoiceButton,
  ManageSubscriptionButton,
} from "@/components/dashboard/billing-actions";
import { auth } from "@/lib/auth";
import { getBillingSummary } from "@/lib/billing/store";
import { headers } from "next/headers";

export const runtime = "nodejs";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { subscription, transactions } = session?.user
    ? getBillingSummary(session.user.id)
    : { subscription: undefined, transactions: [] };
  const activeSubscription =
    subscription?.status === "active" || subscription?.status === "non-renewing"
      ? subscription
      : undefined;
  const isNonRenewing = activeSubscription?.status === "non-renewing";
  const amount = transactions[0]?.amount;
  const interval = activeSubscription?.interval === "annually" ? "year" : "month";
  const invoiceCount = transactions.length;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your KES subscription, payment method and invoices.
        </p>
      </div>

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Current Plan</CardDescription>
            <CardTitle className="text-2xl">{activeSubscription?.plan ?? "Free"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={activeSubscription ? "success" : "secondary"}>
              {activeSubscription
                ? isNonRenewing
                  ? "Will not renew"
                  : "Active"
                : "No active plan"}
            </Badge>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Monthly Spend</CardDescription>
            <CardTitle className="text-2xl">
              {activeSubscription && amount ? `KES ${(amount / 100).toFixed(2)}` : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {activeSubscription ? `Billed per ${interval}` : "Upgrade to unlock Pro"}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Invoices</CardDescription>
          <CardTitle className="text-2xl">{invoiceCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verified payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription */}

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current subscription details.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Plan</p>
              <p className="text-sm text-muted-foreground">
                {activeSubscription?.plan ?? "Free"}
              </p>
            </div>
            <Badge variant={activeSubscription ? "success" : "secondary"}>
              {activeSubscription
                ? isNonRenewing
                  ? "Will not renew"
                  : "Active"
                : "Inactive"}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Billing cycle</p>
              <p className="text-sm text-muted-foreground">
                {activeSubscription?.interval === "annually" ? "Annual" : "Monthly"}
              </p>
            </div>
            <span className="font-medium">
              {activeSubscription && amount ? `KES ${(amount / 100).toFixed(2)}/${interval}` : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Next invoice</p>
              <p className="text-sm text-muted-foreground">
                {activeSubscription
                  ? isNonRenewing
                    ? "This subscription will not renew."
                    : "Managed through Paystack"
                  : "Start a Pro subscription"}
              </p>
            </div>
            <ManageSubscriptionButton />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Payments are securely handled by Paystack.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <CreditCardIcon className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Managed by Paystack</p>
                <p className="text-sm text-muted-foreground">No card data is stored by Apalis.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing history */}

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium">Billing History</h2>
          <p className="text-sm text-muted-foreground">
            Download invoices and review previous payments.
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Invoice
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Amount
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                      No verified payments yet.
                    </TableCell>
                  </TableRow>
                ) : transactions.map((transaction) => (
                  <TableRow key={transaction.reference}>
                    <TableCell className="px-6 py-4">
                      <p className="font-mono text-sm">{transaction.reference}</p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {transaction.paidAt
                        ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(transaction.paidAt))
                        : "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium">
                      {transaction.currency} {(transaction.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="success">Paid</Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <DownloadInvoiceButton invoiceId={transaction.reference} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Danger Zone */}

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Permanently cancel your subscription. You&apos;ll continue to have
            access until the end of your current billing period.
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <p className="font-medium">Cancel subscription</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This action can be reversed before your renewal date.
              </p>
            </div>
            {activeSubscription?.status === "active" ? <CancelSubscriptionButton /> : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
