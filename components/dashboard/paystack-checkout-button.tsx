"use client";

import { useState } from "react";
import { ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function PaystackCheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: "monthly" }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.authorizationUrl) {
        throw new Error(payload.error || "Unable to start checkout.");
      }

      window.location.assign(payload.authorizationUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start checkout.");
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={startCheckout} disabled={isLoading}>
      <ExternalLinkIcon className="size-4" />
      {isLoading ? "Opening checkout…" : "Continue to payment"}
    </Button>
  );
}
