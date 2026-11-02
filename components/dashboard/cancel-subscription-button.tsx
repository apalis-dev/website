"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CancelSubscriptionButtonProps {
  disabled?: boolean;
}

export function CancelSubscriptionButton({
  disabled,
}: CancelSubscriptionButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelSubscription = async () => {
    setIsCancelling(true);

    try {
      const response = await fetch("/api/billing/cancel", {
        method: "POST",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error ?? "We couldn't cancel this subscription."
        );
      }

      toast.success(
        "Subscription set to end at the end of the current billing period."
      );
      setConfirming(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We couldn't cancel this subscription."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (!confirming) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setConfirming(true)}
        disabled={disabled}
      >
        Cancel renewal
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={cancelSubscription}
        disabled={isCancelling}
      >
        {isCancelling ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <RotateCcw className="size-4" />
        )}
        {isCancelling ? "Cancelling…" : "Confirm cancellation"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(false)}
        disabled={isCancelling}
      >
        Keep subscription
      </Button>
    </div>
  );
}
