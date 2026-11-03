"use client";

import { useRouter } from "next/navigation";
import { SubscriptionDetailsButton } from "@clerk/nextjs/experimental";

import { Button } from "@/components/ui/button";

export function ManageSubscriptionButton() {
  const router = useRouter();

  return (
    <SubscriptionDetailsButton
      for="organization"
      onSubscriptionCancel={() => router.refresh()}
    >
      <Button variant="outline" size="sm">
        Manage payment details
      </Button>
    </SubscriptionDetailsButton>
  );
}
