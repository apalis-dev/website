"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  deleteAppAction,
  updateAppAction,
} from "@/app/dashboard/apps/actions";
import type { DashboardApp } from "@/lib/dashboard/types";

interface AppSettingsContentProps {
  app: DashboardApp;
}

export function AppSettingsContent({ app }: AppSettingsContentProps) {
  const router = useRouter();
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const saveChanges = () => {
    setError(null);

    startTransition(async () => {
      const result = await updateAppAction({
        appId: app.id,
        name,
        description,
      });

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Settings saved");
      router.refresh();
    });
  };

  const deleteApp = () => {
    if (
      !window.confirm(
        `Delete ${app.name}? This removes the app from the workspace and cannot be undone.`
      )
    ) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await deleteAppAction(app.id);

      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Application deleted");
      router.push("/dashboard/apps");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your application's configuration and lifecycle.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>
            Basic information about your application.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid gap-8 md:grid-cols-[180px_1fr]">
            <div>
              <h4 className="text-sm font-medium">Application name</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Displayed throughout your dashboard.
              </p>
            </div>

            <div className="max-w-md space-y-2">
              <Label htmlFor="app-name">Name</Label>
              <Input
                id="app-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-8 md:grid-cols-[180px_1fr]">
            <div>
              <h4 className="text-sm font-medium">Description</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Optional description to help identify this application.
              </p>
            </div>

            <div className="max-w-xl space-y-2">
              <Label htmlFor="app-description">Description</Label>
              <Input
                id="app-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Production payment service"
              />
            </div>
          </div>

          <Separator />

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Button onClick={saveChanges} disabled={pending}>
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            These actions are permanent and cannot be undone.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 rounded-lg border border-destructive/20 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="font-medium">Delete application</h4>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                Permanently delete <strong>{app.name}</strong>, including its API
                key, webhook endpoints, tickets and all associated data. The
                workspace plan and other apps are not affected.
              </p>
            </div>

            <Button
              variant="destructive"
              onClick={deleteApp}
              disabled={pending}
            >
              <Trash2Icon className="size-4" />
              {pending ? "Working..." : "Delete App"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
