"use client";

import { CreditCardIcon, DownloadIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaystackCheckoutButton } from "@/components/dashboard/paystack-checkout-button";

interface BillingActionsProps {
  invoiceId: string;
}

export function DownloadInvoiceButton({ invoiceId }: BillingActionsProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toast.success(`Downloading ${invoiceId}`)}
    >
      <DownloadIcon className="size-4" />
    </Button>
  );
}

export function ManageSubscriptionButton() {
  return <PaystackCheckoutButton />;
}

export function UpdateCardButton() {
  return (
    <Button
      variant="outline"
      onClick={() => toast.info("Opening billing portal...")}
    >
      Update Card
    </Button>
  );
}

export function CancelSubscriptionButton() {
  const [isCancelling, setIsCancelling] = useState(false);

  return (
    <Button
      variant="destructive"
      disabled={isCancelling}
      onClick={async () => {
        if (!window.confirm("Cancel renewal for this subscription? You will keep access until the current period ends.")) {
          return;
        }

        setIsCancelling(true);
        try {
          const response = await fetch("/api/billing/cancel", { method: "POST" });
          const payload = (await response.json()) as { error?: string };

          if (!response.ok) throw new Error(payload.error ?? "Unable to cancel subscription.");

          toast.success("Your subscription will not renew.");
          window.location.reload();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Unable to cancel subscription.");
        } finally {
          setIsCancelling(false);
        }
      }}
    >
      {isCancelling && <LoaderCircle className="size-4 animate-spin" />}
      {isCancelling ? "Cancelling..." : "Cancel subscription"}
    </Button>
  );
}

export { CreditCardIcon, Badge };
