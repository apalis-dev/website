"use client";

import { useState } from "react";
import { useClerk, useReverification } from "@clerk/nextjs";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { deleteAccountAction } from "@/app/dashboard/settings/actions";
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
  const { signOut } = useClerk();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = useReverification(async () => {
    const result = await deleteAccountAction();

    if (!result.ok) {
      throw new Error(result.error);
    }

    toast.success("Your account has been deleted");
  });

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);

    try {
      await deleteAccount();

      // The user no longer exists, so clear the stale client session and
      // return to the sign-in page.
      await signOut({ redirectUrl: "/login" });
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
              Permanently delete your account and profile. Workspaces where you
              are the only member are deleted too, and their subscriptions end
              immediately. Workspaces with other members are kept.
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
              . If you own a workspace with other members, delete that
              workspace first. If you are the last admin of a shared
              workspace, add another admin first. This cannot be undone.
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
