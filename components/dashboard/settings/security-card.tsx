"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PasswordSection } from "./password-section";
import { TwoFactorSection } from "./two-factor-section";
import type { ClerkUser } from "./types";

interface SecurityCardProps {
  user: ClerkUser;
}

export function SecurityCard({ user }: SecurityCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        <PasswordSection user={user} />
        <TwoFactorSection user={user} />
      </CardContent>
    </Card>
  );
}
