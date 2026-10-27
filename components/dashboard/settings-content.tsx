"use client";

import { useUser } from "@clerk/nextjs";

import { Skeleton } from "@/components/ui/skeleton";

import { ApiKeysCard } from "./settings/api-keys-card";
import { DangerZoneCard } from "./settings/danger-zone-card";
import { ProfileCard } from "./settings/profile-card";
import { SecurityCard } from "./settings/security-card";

export function SettingsContent() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProfileCard user={user} />
      <ApiKeysCard />
      <SecurityCard user={user} />
      <DangerZoneCard user={user} />
    </div>
  );
}
