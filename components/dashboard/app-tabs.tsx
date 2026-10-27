"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface AppTabsProps {
  appId: string;
}

const tabs = [
  { label: "Overview", segment: "" },
  { label: "API Keys", segment: "/api-keys" },
  { label: "Subscription", segment: "/subscription" },
  { label: "Tickets", segment: "/tickets" },
  { label: "Settings", segment: "/settings" },
];

export function AppTabs({ appId }: AppTabsProps) {
  const pathname = usePathname() ?? "";
  const basePath = `/dashboard/apps/${appId}`;

  return (
    <nav className="-mb-px flex items-center gap-5 border-b">
      {tabs.map((tab) => {
        const href = `${basePath}${tab.segment}`;

        const isActive =
          tab.segment === ""
            ? pathname === basePath
            : pathname.startsWith(href);

        return (
          <Link
            key={tab.segment}
            href={href as any}
            className={cn(
              "relative flex h-10 items-center border-b-2 border-transparent text-sm font-medium transition-colors",
              isActive
                ? "border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
