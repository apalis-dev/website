"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BookOpenIcon,
  CreditCardIcon,
  GaugeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  MoreVertical,
  SettingsIcon,
  SunIcon,
} from "lucide-react";

import { signOut } from "@/lib/auth/auth-client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarFooterDropdownProps {
  name: string;
  email: string;
  plan: string;
  avatarSrc?: string;
  initials: string;
}

const themeConfig = {
  light: {
    icon: SunIcon,
    label: "Light",
  },
  dark: {
    icon: MoonIcon,
    label: "Dark",
  },
  system: {
    icon: MonitorIcon,
    label: "System",
  },
} as const;

export function SidebarFooterDropdown({
  name,
  email,
  plan,
  avatarSrc,
  initials,
}: SidebarFooterDropdownProps) {
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const currentTheme = (theme as keyof typeof themeConfig) ?? "system";

  const ThemeIcon = mounted ? themeConfig[currentTheme].icon : MonitorIcon;

  return (
    <DropdownMenu>
      <div className="relative">
        <SidebarMenuButton
          size="lg"
          className="cursor-default duration-200 ease-linear"
        >
          <Avatar size="sm">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}

            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex w-full items-center justify-between overflow-hidden">
            <span className="truncate text-sm font-medium">{name}</span>

            <MoreVertical className="size-4 shrink-0 text-muted-foreground" />
          </div>
        </SidebarMenuButton>

        <DropdownMenuTrigger
          className="absolute inset-0 opacity-0"
          aria-label="User menu"
        >
          Open
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align="end" className="w-72 rounded-lg p-2">
        <DropdownMenuGroup>
          <Card className="relative border-0 bg-muted/40 p-6 shadow-none">
            <Badge
              variant="secondary"
              className="absolute right-4 top-4 rounded-full px-2.5 uppercase tracking-wide"
            >
              {plan}
            </Badge>

            <div className="flex flex-col items-center text-center">
              <Avatar className="size-14 ring-2 ring-border">
                {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}

                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <h3 className="mt-4 text-base font-semibold">{name}</h3>

              <p className="mt-1 text-sm text-muted-foreground">{email}</p>
            </div>
          </Card>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 pb-1 text-xs font-medium text-muted-foreground">
            Workspace
          </DropdownMenuLabel>

          <DropdownMenuItem
            render={
              <Link
                href="/dashboard"
                className="flex cursor-pointer items-center gap-3"
              />
            }
          >
            <GaugeIcon className="size-4" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem
            render={
              <Link
                href="/dashboard/settings"
                className="flex cursor-pointer items-center gap-3"
              />
            }
          >
            <SettingsIcon className="size-4" />
            Account Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            render={
              <Link
                href="/dashboard/billing"
                className="flex cursor-pointer items-center gap-3"
              />
            }
          >
            <CreditCardIcon className="size-4" />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 pb-1 text-xs font-medium text-muted-foreground">
            Resources
          </DropdownMenuLabel>

          <DropdownMenuItem
            render={
              <Link
                href="/docs"
                className="flex cursor-pointer items-center gap-3"
              />
            }
          >
            <BookOpenIcon className="size-4" />
            Documentation
          </DropdownMenuItem>

          <DropdownMenuItem
            render={
              <Link
                href={"/support" as any}
                className="flex cursor-pointer items-center gap-3"
              />
            }
          >
            <LifeBuoyIcon className="size-4" />
            Support
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 pb-1 text-xs font-medium text-muted-foreground">
            Preferences
          </DropdownMenuLabel>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-3">
              <ThemeIcon className="size-4" />
              Theme
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent className="w-44">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <SunIcon className="size-4" />
                  Light
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <MoonIcon className="size-4" />
                  Dark
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <MonitorIcon className="size-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleLogout}
            className="gap-3 rounded-md text-destructive focus:text-destructive"
          >
            <LogOutIcon className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
