import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { SettingsContent } from "@/components/dashboard/settings-content";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and API keys.
        </p>
      </div>

      <SettingsContent
        initialName={session?.user?.name ?? ""}
        initialEmail={session?.user?.email ?? ""}
      />
    </div>
  );
}