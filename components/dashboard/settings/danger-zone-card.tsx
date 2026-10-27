"use client";

import { useState } from "react";
import { useReverification } from "@clerk/nextjs";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ClerkUser } from "./types";
import { getErrorMessage } from "./utils";

interface DangerZoneCardProps {
  user: ClerkUser;
}

export function DangerZoneCard({ user }: DangerZoneCardProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = useReverification(async () => {
    const cancelResponse = await fetch("/api/billing/cancel", {
      method: "POST",
    });

    if (!cancelResponse.ok && cancelResponse.status !== 400) {
      const payload = await cancelResponse.json().catch(() => null);

      throw new Error(
        payload?.error ??
          "Cancel your active subscription before deleting your account."
      );
    }

    await user.delete();
  });

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);

    try {
      await deleteAccount();
      toast.success("Your account has been deleted");
      router.push("/login");
      router.refresh()
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError, "We couldn't delete your account.")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card size="sm" className="ring-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Delete account</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and profile. We&apos;ll cancel an
              active subscription first.
            </p>
          </div>

          {!confirming && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirming(true)}
            >
              <Trash2Icon />
              Delete account
            </Button>
          )}
        </div>

        {confirming && (
          <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm">
              This will permanently delete the account for{" "}
              <span className="font-medium">
                {user.primaryEmailAddress?.emailAddress}
              </span>
              . Any active subscription will be cancelled first. This cannot be
              undone.
            </p>

            {error && (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Yes, delete my account"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setConfirming(false);
                  setError(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
