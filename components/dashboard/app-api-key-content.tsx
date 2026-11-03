"use client";

import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  KeyRoundIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiKeyPageProps {
  apiKeyId?: string;
  apiKeyPreview?: string;
}

export function ApiKeyPage({ apiKeyId, apiKeyPreview }: ApiKeyPageProps) {
  const [copied, setCopied] = useState(false);
  const hasKey = Boolean(apiKeyId);

  const handleCopy = async () => {
    if (!apiKeyId) return;

    await navigator.clipboard.writeText(apiKeyId);

    setCopied(true);
    toast.success("API key ID copied");

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Production API Key</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <KeyRoundIcon className="size-4 text-muted-foreground" />
              Production
            </div>

            {hasKey ? (
              <code className="block overflow-x-auto rounded-md bg-background px-3 py-2 font-mono text-xs">
                {apiKeyPreview ?? apiKeyId}
              </code>
            ) : (
              <p className="text-sm text-muted-foreground">
                No API key has been created for this application.
              </p>
            )}

            <p className="mt-3 text-sm text-muted-foreground">
              Apalis stores only the Clerk API key ID. The full secret is shown
              once when the key is created or rotated.
            </p>
          </div>

          {hasKey ? (
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <CheckIcon className="size-4 text-brand" />
              ) : (
                <CopyIcon className="size-4" />
              )}

              {copied ? "Copied" : "Copy key ID"}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Key creation will be available once Clerk API Keys is enabled for
              this environment.
            </p>
          )}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 font-medium">
                <ShieldAlertIcon className="size-4 text-destructive" />
                Revoke API Key
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Revocation is not available yet. Applications using this key
                will keep authenticating until key management is enabled.
              </p>
            </div>

            <Button variant="destructive" size="sm" disabled>
              Revoke
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
