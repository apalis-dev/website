"use client";

import Link from "next/link";
import { Logo } from "../atoms/logo";
import { Icon } from "../icons";
import { Search } from "../atoms/search";
import { usePathname } from "next/navigation";
import React from "react";
import { MobileMenu } from "./mobile-menu";

export interface NavigationLink {
  readonly name: string;
  readonly href: string;
  readonly reload?: boolean;
}

const links: Array<NavigationLink> = [
  { name: "Docs", href: "/docs" },
  { name: "Blog", href: "/blog" },
  { name: "Pricing", href: "/pricing" },
];

const socials = [
  { name: "GitHub", icon: "github", href: "https://github.com/apalis-dev" },
  { name: "Discord", icon: "discord", href: "https://discord.gg/W29BYSXXmp" },
];

export const Navigation: React.FC<{
  wide?: boolean | false;
  searchBox?: boolean | false;
  themeSwitcher?: boolean | false;
  inline?: boolean;
}> = ({ wide, searchBox, themeSwitcher, inline = false }) => {
  return (
    <div>
      <header
        className={`${
          inline ? "relative" : "fixed top-0 inset-x-0"
        } z-30 backdrop-blur-xl border-b border-border/40 bg-zinc-50 dark:bg-black text-zinc-700 dark:text-zinc-400`}
      >
        <div
          className={`w-full ${
            inline
              ? "border-b dark:border-neutral-700"
              : wide
              ? "max-w-(--breakpoint-2xl)"
              : "max-w-(--breakpoint-2xl)"
          } mx-auto px-4 sm:px-8 lg:px-16 h-16 sm:h-24 flex justify-between items-center`}
        >
          <Link href="/" className="z-50">
            <Logo className="hidden dark:block h-7 sm:h-8" />
          </Link>
          <MobileMenu menu={links} socials={socials} />
          <div className="hidden md:flex items-center gap-3">
            <NavigationMenu />
            {searchBox && <Search className="w-56" />}
            <div className="flex items-center gap-4">
              {socials.map(({ name, icon, href }, index) => (
                <Link key={index} href={href} className="generic-hover">
                  <span className="sr-only">{name}</span>
                  <Icon
                    name={icon as Icon.Name}
                    className="h-5 text-zinc-700 dark:text-zinc-400"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export function NavigationMenu() {
  return <NavigationLinks links={links} />;
}

const NavigationLinks: React.FC<{ links: ReadonlyArray<NavigationLink> }> = (
  props
) => {
  const pathname = usePathname();

  const shouldReload = props.links.some(
    (link) => link.href === pathname && link.reload
  );
  const links = shouldReload
    ? props.links.map((link) => ({ ...link, reload: true }))
    : props.links;

  return (
    <>
      {links.map((link, index) => (
        <NavigationLink key={index} {...link} />
      ))}
    </>
  );
};

function NavigationLink({ name, href, reload }: NavigationLink) {
  const pathname = usePathname();
  const Component = reload ? "a" : Link;
  return (
    <Component
      href={href}
      className={`h-8 cursor-pointer flex border dark:bg-black border-[#333333] hover:border-white/50 transition duration-300 ease-in-out rounded items-center px-3 text-[13px] justify-center ${
        pathname?.startsWith(href)
          ? "text-black font-normal dark:text-white dark:font-light"
          : ""
      }`}
    >
      <span>{name}</span>
      {href.startsWith("http") && (
        <Icon name="arrow-up-right-light" className="h-3.5 mt-0.5 ml-0.5" />
      )}
    </Component>
  );
}
