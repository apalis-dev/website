import { SettingsContent } from "@/components/dashboard/settings-content";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and API keys.
        </p>
      </div>

      <SettingsContent />
    </div>
  );
}
