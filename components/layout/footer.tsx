"use client"

import Link from "next/link"
import { Logo } from "../atoms/logo"
import { Divider } from "./divider"
import { Icon } from "../icons"
import { usePathname } from "next/navigation"

const menus = [
  {
    name: "Docs",
    items: [
      { name: "Getting Started", href: "/docs/introduction/quickstart" },
      { name: "Guides", href: "/docs/guides" },
      { name: "apalis", href: "https://docs.rs/apalis" },
      { name: "apalis-core", href: "https://docs.rs/apalis-core", blank: true },
      { name: "apalis-workflow", href: "https://docs.rs/apalis-workflow", blank: true }
    ]
  },
  {
    name: "Products",
    items: [
      { name: "Web UI", href: "https://github.com/apalis-dev/apalis-board", blank: true },
      { name: "Chirpy", href: "https://github.com/apalis-dev/chirpy", blank: true },
      { name: "Kato", href: "https://github.com/apalis-dev/kato", blank: true },
      { name: "Hooky", href: "https://github.com/apalis-dev/hooky", blank: true },
    ]
  },
  {
    name: "Backends",
    items: [
      {
        name: "apalis-redis",
        href: "https://docs.rs/apalis-redis",
        blank: true
      },
      {
        name: "apalis-postgres",
        href: "https://docs.rs/apalis-postgres",
        blank: true
      },
      {
        name: "apalis-sqlite",
        href: "https://docs.rs/apalis-sqlite",
        blank: true
      },
      {
        name: "apalis-mysql",
        href: "https://docs.rs/apalis-mysql",
        blank: true
      },
      {
        name: "apalis-amqp",
        href: "https://docs.rs/apalis-amqp",
        blank: true
      },
      {
        name: "apalis-nats",
        href: "https://docs.rs/apalis-nats",
        blank: true
      },
      {
        name: "apalis-pgmq",
        href: "https://docs.rs/apalis-pgmq",
        blank: true
      },
    ]
  }
]

const socials = [
  { name: "GitHub", icon: "github", href: "https://github.com/apalis-dev" },
  { name: "Discord", icon: "discord", href: "https://discord.gg/W29BYSXXmp" },
  { name: "Twitter", icon: "twitter", href: "https://twitter.com/apalis_dev" }
]

export const Footer = () => {
  const pathname = usePathname()
  const wide = pathname?.startsWith("/docs")

  return (
    <div className={pathname === "/" ? "dark" : ""}>
      <footer className="bg-zinc-50 dark:bg-black text-zinc-700 dark:text-zinc-400 text-sm">
        <Divider />
        <div
          className={`w-full ${
            wide ? "max-w-(--breakpoint-2xl)" : "max-w-(--breakpoint-2xl)"
          } mx-auto px-4 sm:px-8 lg:px-16 py-24 flex flex-col sm:flex-row gap-10 justify-between`}
        >
          <div>
            <Logo className="hidden dark:block h-7 sm:h-8" />
            {/* <LogoDark className="dark:hidden h-7 sm:h-8" /> */}
            <p className="leading-relaxed my-6">
              MIT Licensed
              <br />
              Copyright © {new Date().getFullYear()} Fuse Technologies Ltd.
            </p>
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
          <div className="flex flex-wrap sm:gap-x-12 gap-y-6 sm:mt-0">
            {menus.map(({ name, items }, index) => (
              <div key={index} className="w-1/2 sm:w-auto">
                <h3 className="text-white mb-4">{name}</h3>
                <ul className="space-y-2">
                  {items.map(({ name, href, blank }, index) => (
                    <li key={index}>
                      <Link
                        href={href}
                        className={`flex items-start ${pathname?.startsWith(href) ? "" : "button-hover"}`}
                        target={blank === true ? "_blank" : "_self"}
                      >
                        <span>{name}</span>
                        {href.startsWith("http") && (
                          <Icon
                            name="arrow-up-right-light"
                            className="h-3 mt-0.5 ml-0.5"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
