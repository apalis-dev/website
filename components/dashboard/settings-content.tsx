"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SettingsContentProps {
  initialName: string;
  initialEmail: string;
}

const globalKeys = [
  { id: "key-1", label: "Production", key: "apk_live_7f3k9m2n8p1q4r6s", created: "2025-11-12" },
  { id: "key-2", label: "Staging", key: "apk_test_2a8b4c6d9e1f3g5h", created: "2025-12-01" },
];

export function SettingsContent({ initialName, initialEmail }: SettingsContentProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="grid gap-2 py-3 sm:max-w-sm">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2 py-3 sm:max-w-sm">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-muted-foreground">Save changes</span>
            <Button size="sm" onClick={() => toast.success("Profile updated")}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>API Keys</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast.info("Create new key…")}>
              Generate new key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="divide-y">
          {globalKeys.map((entry) => (
            <div key={entry.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.label}</span>
                    <Badge variant="secondary">
                      {entry.key.startsWith("apk_live_") ? "live" : "test"}
                    </Badge>
                  </div>
                  <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                    {entry.key.slice(0, 16)}{"•".repeat(6)}
                  </code>
                  <p className="text-xs text-muted-foreground">
                    Created {entry.created}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(entry.id, entry.key)}>
                    {copiedId === entry.id ? (
                      <CheckIcon className="text-brand" />
                    ) : (
                      <CopyIcon />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info(`Regenerating ${entry.label} key…`)}>
                    <RefreshCwIcon />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change password
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2Icon />
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}