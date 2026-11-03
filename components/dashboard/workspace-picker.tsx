"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useOrganizationList } from "@clerk/nextjs";
import {
  ArrowRightIcon,
  Building2Icon,
  CheckIcon,
  LoaderCircle,
  LogOutIcon,
  PlusIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkspaceSummary } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

interface WorkspacePickerProps {
  workspaces: WorkspaceSummary[];
  activeWorkspaceId: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function WorkspacePicker({
  workspaces,
  activeWorkspaceId,
}: WorkspacePickerProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isLoaded, setActive, createOrganization } = useOrganizationList();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectWorkspace = async (workspaceId: string) => {
    if (!isLoaded || !setActive) return;

    setError(null);
    setPendingId(workspaceId);

    try {
      // Passing `navigate` is what lets Clerk finish a pending
      // `choose-organization` session task: setActive touches the session with
      // the chosen organization, then hands control back here.
      await setActive({
        organization: workspaceId,
        navigate: async ({ decorateUrl }) => {
          const url = decorateUrl("/dashboard/apps");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
            router.refresh();
          }
        },
      });
    } catch {
      setError("Unable to open that workspace. Try again.");
      setPendingId(null);
    }
  };

  const createWorkspace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Give the workspace a name.");
      return;
    }

    if (!isLoaded || !createOrganization || !setActive) return;

    setError(null);
    setIsCreating(true);

    try {
      const organization = await createOrganization({ name: trimmedName });

      await setActive({
        organization: organization.id,
        navigate: async ({ decorateUrl }) => {
          const url = decorateUrl("/dashboard/apps");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
            router.refresh();
          }
        },
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to create the workspace. Try again."
      );
      setIsCreating(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-5 py-16">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Apalis
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Choose a workspace
          </h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Workspaces are Clerk organizations. Plans, apps, API keys and
            billing all belong to the active workspace.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ redirectUrl: "/login" })}
        >
          <LogOutIcon className="size-4" />
          Sign out
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="space-y-3">
        {workspaces.map((workspace) => {
          const isActive = workspace.id === activeWorkspaceId;
          const isPending = pendingId === workspace.id;

          return (
            <button
              key={workspace.id}
              type="button"
              disabled={Boolean(pendingId) || isCreating}
              onClick={() => selectWorkspace(workspace.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left transition-colors",
                "hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-60",
                isActive && "border-brand/50 bg-brand/5"
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                {getInitials(workspace.name)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-medium">{workspace.name}</span>
                  {isActive && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckIcon className="size-3" />
                      Current
                    </Badge>
                  )}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {workspace.plan} workspace
                </span>
              </span>

              {isPending ? (
                <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
              ) : (
                <ArrowRightIcon className="size-4 text-muted-foreground" />
              )}
            </button>
          );
        })}

        {workspaces.length === 0 && (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <Building2Icon className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 font-medium">No workspaces yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create one below. It starts on the Free plan with one app.
            </p>
          </div>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Create a workspace</CardTitle>
          <CardDescription>
            A new workspace starts on the Free plan. You can upgrade it from
            Billing after it is created.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={createWorkspace} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input
                id="workspace-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Acme Labs"
                maxLength={60}
                disabled={isCreating}
              />
            </div>

            <Button type="submit" disabled={isCreating || !isLoaded}>
              {isCreating ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <PlusIcon className="size-4" />
              )}
              {isCreating ? "Creating..." : "Create workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
