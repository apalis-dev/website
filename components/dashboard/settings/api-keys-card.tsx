"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const globalKeys = [
  {
    id: "key-1",
    label: "Production",
    key: "apk_live_7f3k9m2n8p1q4r6s",
    created: "2025-11-12",
  },
  {
    id: "key-2",
    label: "Staging",
    key: "apk_test_2a8b4c6d9e1f3g5h",
    created: "2025-12-01",
  },
];

export function ApiKeysCard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>API Keys</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Create new key…")}
          >
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
                  {entry.key.slice(0, 16)}
                  {"•".repeat(6)}
                </code>
                <p className="text-xs text-muted-foreground">
                  Created {entry.created}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(entry.id, entry.key)}
                >
                  {copiedId === entry.id ? (
                    <CheckIcon className="text-brand" />
                  ) : (
                    <CopyIcon />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.info(`Regenerating ${entry.label} key…`)
                  }
                >
                  <RefreshCwIcon />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
