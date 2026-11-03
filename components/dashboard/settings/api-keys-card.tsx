import { KeyRoundIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ApiKeysCard() {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRoundIcon className="size-4 text-muted-foreground" />
          <CardTitle>API Keys</CardTitle>
        </div>
        <CardDescription>
          Workspace API key management is not available yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Keys will be scoped to this workspace and managed through Clerk once
          the API Keys feature is enabled for the environment.
        </p>
      </CardContent>
    </Card>
  );
}
