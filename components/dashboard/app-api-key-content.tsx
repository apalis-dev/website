"use client";

import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  KeyRoundIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiKeyPageProps {
  apiKey: string;
}

export function ApiKeyPage({ apiKey }: ApiKeyPageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);

    setCopied(true);
    toast.success("API key copied");

    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    toast.info("Regenerating API key…");
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

            <code className="block overflow-x-auto rounded-md bg-background px-3 py-2 font-mono text-xs">
              {apiKey}
            </code>

            <p className="mt-3 text-sm text-muted-foreground">
              Use this key to authenticate requests from your production
              environment. Keep it secret and never expose it in client-side
              code.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <CheckIcon className="size-4 text-brand" />
              ) : (
                <CopyIcon className="size-4" />
              )}

              {copied ? "Copied" : "Copy"}
            </Button>

            <Button variant="outline" size="sm" onClick={handleRegenerate}>
              <RefreshCwIcon className="size-4" />
              Rotate Key
            </Button>
          </div>
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
                Permanently revoke this key. Applications using it will stop
                authenticating immediately.
              </p>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error("API key revoked")}
            >
              Revoke
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
