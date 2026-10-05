"use client";

import { useState } from "react";
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
import type { DashboardApp } from "@/lib/dashboard/types";

interface AppSettingsContentProps {
  app: DashboardApp;
}

export function AppSettingsContent({ app }: AppSettingsContentProps) {
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description ?? "");

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

          <div className="flex justify-end">
            <Button onClick={() => toast.success("Settings saved")}>
              Save changes
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
                Permanently delete <strong>{app.name}</strong>, including API
                keys, webhook endpoints, subscriptions, logs and all associated
                data.
              </p>
            </div>

            <Button
              variant="destructive"
              onClick={() => toast.error("Deletion requires confirmation")}
            >
              <Trash2Icon className="size-4" />
              Delete App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
