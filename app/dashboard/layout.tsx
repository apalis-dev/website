import { ReactNode } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return <DashboardShell>{children}</DashboardShell>
}
