import type { DashboardApp, Ticket } from "./types";

export function getAppById(
  workspace: { apps: DashboardApp[] },
  appId: string
): DashboardApp | undefined {
  return workspace.apps.find((app) => app.id === appId);
}

export function getWorkspaceTickets(workspace: {
  id: string;
  apps: DashboardApp[];
}): Ticket[] {
  return mockTickets.filter((ticket) => ticket.orgId === workspace.id);
}

export function getTicketsByAppId(
  workspace: { id: string; apps: DashboardApp[] },
  appId: string
): Ticket[] {
  return getWorkspaceTickets(workspace).filter(
    (ticket) => ticket.appId === appId
  );
}

/**
 * A masked key preview for the UI. The real secret is only returned once by
 * Clerk when a key is created or rotated; it is never stored in app metadata.
 */
export function getApiKeyPreview(app: DashboardApp): string | undefined {
  if (!app.apiKeyId) return undefined;

  return `apk_live_${app.apiKeyId.slice(-4)}••••••••`;
}

export const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    orgId: "org_apalis_labs",
    appId: "app_stockbot",
    subject: "API rate limit exceeded",
    description: "Getting 429 errors during peak hours.",
    status: "open",
    priority: "high",
    createdAt: "2026-07-05",
    updatedAt: "2026-07-05",
  },
  {
    id: "TKT-002",
    orgId: "org_apalis_labs",
    appId: "app_stockbot",
    subject: "Webhook delivery delay",
    description: "Webhooks are delayed by 30+ seconds.",
    status: "in_progress",
    priority: "medium",
    createdAt: "2026-07-03",
    updatedAt: "2026-07-06",
  },
  {
    id: "TKT-003",
    orgId: "org_apalis_labs",
    appId: "app_email_worker",
    subject: "Upgrade to Pro plan",
    description: "Need help upgrading from Free to Pro.",
    status: "resolved",
    priority: "low",
    createdAt: "2026-06-28",
    updatedAt: "2026-07-01",
  },
  {
    id: "TKT-004",
    orgId: "org_apalis_labs",
    appId: "app_webhook_dispatcher",
    subject: "Duplicate webhook deliveries",
    description: "Some events are delivered twice after a retry.",
    status: "open",
    priority: "high",
    createdAt: "2026-07-07",
    updatedAt: "2026-07-07",
  },
  {
    id: "TKT-101",
    orgId: "org_john_pro",
    appId: "app_stockbot_personal",
    subject: "Dashboard shows stale usage",
    description: "Usage figures have not refreshed since yesterday.",
    status: "open",
    priority: "medium",
    createdAt: "2026-07-08",
    updatedAt: "2026-07-08",
  },
];
