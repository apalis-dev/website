"use client";

import { useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { deleteWorkspaceAction } from "@/app/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/lib/dashboard/workspace-context";

export function WorkspaceDangerZoneCard() {
  const { userId } = useAuth();
  const { setActive } = useClerk();
  const { workspace } = useWorkspace();
  const [confirming, setConfirming] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner =
    workspace.members.find((member) => member.id === userId)?.role === "owner";
  const canDelete = confirmationName.trim() === workspace.name;

  const handleDeleteWorkspace = async () => {
    if (!canDelete) return;

    setDeleting(true);
    setError(null);

    try {
      const result = await deleteWorkspaceAction();

      if (!result.ok) {
        throw new Error(result.error);
      }

      try {
        await setActive({ organization: null });
      } catch {
        // The organization no longer exists; a full navigation below will
        // still clear the stale active organization from the session.
      }

      window.location.assign("/select-workspace");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "We couldn't delete this workspace."
      );
      setDeleting(false);
    }
  };

  return (
    <Card size="sm" className="ring-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">Workspace danger zone</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Delete workspace</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete {workspace.name}, its apps, and its
              subscription. This cancels billing immediately and cannot be
              undone.
            </p>
          </div>

          {!confirming && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirming(true)}
              disabled={!isOwner}
            >
              <Trash2Icon />
              Delete workspace
            </Button>
          )}
        </div>

        {!isOwner && (
          <p className="text-sm text-muted-foreground">
            Only the workspace owner can delete this workspace.
          </p>
        )}

        {confirming && (
          <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm">
              This will cancel the subscription and permanently delete every
              app in <span className="font-medium">{workspace.name}</span>.
            </p>

            <div className="mt-4 max-w-sm space-y-2">
              <Label htmlFor="delete-workspace-name">
                Type <span className="font-medium">{workspace.name}</span> to
                confirm
              </Label>
              <Input
                id="delete-workspace-name"
                value={confirmationName}
                onChange={(event) => setConfirmationName(event.target.value)}
                placeholder={workspace.name}
                disabled={deleting}
                autoComplete="off"
              />
            </div>

            {error && (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteWorkspace}
                disabled={deleting || !canDelete}
              >
                {deleting ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Yes, delete this workspace"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setConfirming(false);
                  setConfirmationName("");
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
