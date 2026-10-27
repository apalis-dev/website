import { ReactNode } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  return <DashboardShell>{children}</DashboardShell>
}
