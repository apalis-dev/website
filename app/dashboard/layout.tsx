import { ReactNode } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WorkspaceProvider } from "@/lib/dashboard/workspace-context"
import {
  getAvailableWorkspaces,
  getDashboardWorkspace,
} from "@/lib/dashboard/workspace-server"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { userId, sessionStatus } = await auth({
    treatPendingAsSignedOut: false,
  })

  if (!userId) {
    redirect("/login")
  }

  if (sessionStatus === "pending") {
    redirect("/select-workspace")
  }

  const [workspace, workspaces] = await Promise.all([
    getDashboardWorkspace(),
    getAvailableWorkspaces(),
  ])

  return (
    <WorkspaceProvider workspace={workspace} workspaces={workspaces}>
      <DashboardShell>{children}</DashboardShell>
    </WorkspaceProvider>
  )
}
