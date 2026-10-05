"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxesIcon,
  MessagesSquareIcon,
  WalletIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import { useSession } from "@/lib/auth/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarHeaderDropdown } from "./sidebar-header-dropdown";
import { SidebarFooterDropdown } from "./sidebar-footer-dropdown";

const navGroups = [
  {
    className: "border-b border-border",
    items: [
      {
        title: "Apps",
        href: "/dashboard/apps",
        icon: BoxesIcon,
      },
      {
        title: "Tickets",
        href: "/dashboard/tickets",
        icon: MessagesSquareIcon,
      },
    ],
  },
  {
    className: "border-b border-border",
    items: [
      {
        title: "Billing",
        href: "/dashboard/billing",
        icon: WalletIcon,
      },
    ],
  },
  {
    className: "",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: SlidersHorizontalIcon,
      },
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppSidebar() {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();

  const user = session?.user;

  const name = user?.name ?? "—";
  const email = user?.email ?? "—";
  const image = user?.image ?? undefined;
  const initials = user ? getInitials(user.name) : "—";

  return (
    <Sidebar
      collapsible="icon"
      className="top-[var(--header-height)] !h-[calc(100svh-var(--header-height))] overflow-hidden"
      style={
        {
          "--sidebar": "var(--background)",
          "--sidebar-foreground": "var(--foreground)",
          "--sidebar-border": "transparent",
          "--sidebar-accent": "var(--accent)",
          "--sidebar-accent-foreground": "var(--accent-foreground)",
          willChange: "width",
          borderRight: "none",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="border-b border-border py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarHeaderDropdown
              name={name}
              initials={initials}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, index) => (
          <SidebarGroup key={index} className={group.className}>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard/apps"
                      ? pathname === item.href ||
                        pathname.startsWith("/dashboard/apps/")
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href as any} />}
                        isActive={isActive}
                        tooltip={item.title}
                        className="duration-200 ease-linear data-[active=true]:bg-accent data-[active=true]:text-foreground"
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarFooterDropdown
              name={name}
              email={email}
              plan="free"
              avatarSrc={image}
              initials={initials}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
